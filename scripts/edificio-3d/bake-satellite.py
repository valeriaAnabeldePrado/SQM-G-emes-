"""Hornea la foto satelital del piso para la entrada tipo drone de /edificio-3d.

Uso: python3 scripts/edificio-3d/bake-satellite.py [--debug RUTA.png]

Descarga teselas Sentinel-2 cloudless 2016 de EOX (CC BY 4.0, uso comercial con
atribución) alrededor de Av. Pueyrredón 377, las reproyecta al sistema local de
la escena (el mismo de bake-osm-context.py: x a lo largo de Pueyrredón, z hacia
Peredo) y escribe public/edificio-3d/satelite.jpg: un cuadrado de SIZE metros
centrado en el origen, fila 0 en z = -SIZE/2 y columna 0 en x = -SIZE/2.

No usar las versiones 2018 en adelante: son CC BY-NC-SA (no comercial).
Atribución: "Sentinel-2 cloudless – s2maps.eu by EOX IT Services GmbH
(Contains modified Copernicus Sentinel data 2016)".

Con --debug escribe además un PNG con las calles de contextData.json en rojo,
para comprobar que la foto quedó alineada con el modelo.
"""
import argparse
import importlib.util
import io
import json
import math
import os
import subprocess
import time

import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(__file__)
spec = importlib.util.spec_from_file_location('osm', os.path.join(HERE, 'bake-osm-context.py'))
osm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(osm)

LAYER = 's2cloudless_3857'  # 2016, CC BY 4.0
TILES = 'https://tiles.maps.eox.at/wmts/1.0.0/' + LAYER + '/default/g/{z}/{y}/{x}.jpg'
ZOOM = 14  # ~9,5 m por píxel: la resolución real de Sentinel-2 es 10 m
SIZE = 8000  # m de lado (lo que se ve desde 6 km de altura)
PIXELS = 1024
OUT = os.path.join(HERE, '..', '..', 'public', 'edificio-3d', 'satelite.jpg')
CONTEXT = os.path.join(HERE, '..', '..', 'src', 'components', 'web-sections', 'edificio-3d',
                       'context', 'contextData.json')


def to_geo(x, z):
    """Inversa de osm.to_local (la matriz [[UX, UY], [VX, VY]] es su propia inversa)."""
    u = x
    v = z + osm.FRONT_LINE_V
    east = u * osm.UX + v * osm.VX
    north = u * osm.UY + v * osm.VY
    lon = osm.LON0 + east / (111320 * math.cos(math.radians(osm.LAT0)))
    lat = osm.LAT0 + north / 110540
    return lat, lon


def mercator(lat, lon, zoom=ZOOM):
    """Píxel global Web Mercator (256 px por tesela)."""
    n = 256 * 2 ** zoom
    x = (lon + 180) / 360 * n
    y = (1 - np.arcsinh(np.tan(np.radians(lat))) / math.pi) / 2 * n
    return x, y


def fetch_tile(x, y):
    url = TILES.format(z=ZOOM, y=y, x=x)
    for attempt in range(4):
        result = subprocess.run(['curl', '-sf', '-A', 'vivra-edificio-3d', url], capture_output=True)
        if result.returncode == 0:
            return Image.open(io.BytesIO(result.stdout)).convert('RGB')
        time.sleep(2 * (attempt + 1))
    raise RuntimeError(f'No se pudo bajar {url}')


def bake():
    half = SIZE / 2
    step = SIZE / PIXELS
    coords = (np.arange(PIXELS) + 0.5) * step - half
    xs, zs = np.meshgrid(coords, coords)  # fila = z, columna = x
    lat, lon = to_geo(xs, zs)
    px, py = mercator(lat, lon)

    tx0, tx1 = int(px.min() // 256) - 1, int(px.max() // 256) + 1
    ty0, ty1 = int(py.min() // 256) - 1, int(py.max() // 256) + 1
    mosaic = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256, 3), dtype=np.float32)
    for ty in range(ty0, ty1 + 1):
        for tx in range(tx0, tx1 + 1):
            tile = np.asarray(fetch_tile(tx, ty), dtype=np.float32)
            mosaic[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = tile
            time.sleep(0.1)

    # Muestreo bilineal en el mosaico
    mx = px - tx0 * 256 - 0.5
    my = py - ty0 * 256 - 0.5
    x0 = np.floor(mx).astype(int)
    y0 = np.floor(my).astype(int)
    fx = (mx - x0)[..., None]
    fy = (my - y0)[..., None]
    a = mosaic[y0, x0]
    b = mosaic[y0, x0 + 1]
    c = mosaic[y0 + 1, x0]
    d = mosaic[y0 + 1, x0 + 1]
    out = (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def debug(image, path):
    data = json.load(open(CONTEXT))
    canvas = image.copy()
    draw = ImageDraw.Draw(canvas)
    to_px = lambda x, z: ((x + SIZE / 2) / SIZE * PIXELS, (z + SIZE / 2) / SIZE * PIXELS)
    for road in data['roads']:
        draw.line([to_px(x, z) for x, z in road['p']], fill=(255, 0, 0), width=1)
    canal = data.get('canal')
    if canal:
        draw.line([to_px(x, z) for x, z in canal['axis']], fill=(0, 200, 255), width=2)
    # Recorte central ampliado (±1000 m) para ver la alineación de cerca
    side = PIXELS * 2000 / SIZE
    c0 = PIXELS / 2 - side / 2
    canvas.crop((c0, c0, c0 + side, c0 + side)).resize((1024, 1024), Image.NEAREST).save(path)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--debug', help='PNG con las calles del modelo encima')
    args = parser.parse_args()
    image = bake()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    image.save(OUT, 'JPEG', quality=85, progressive=True, optimize=True)
    print(f'{os.path.relpath(OUT)}: {os.path.getsize(OUT) // 1024} KB')
    if args.debug:
        debug(image, args.debug)
        print(f'debug: {args.debug}')


if __name__ == '__main__':
    main()
