"""Reemplaza los edificios del contexto por huellas con altura real.

Uso (después de bake-osm-context.py):
    pip install duckdb rasterio pyproj numpy pillow
    python3 scripts/edificio-3d/bake-heights.py

- Huellas: Overture Maps (buildings), que combina OSM, Microsoft y Google
  Open Buildings. Licencia ODbL / CDLA.
- Alturas: Google Open Buildings 2.5D Temporal (2023, CC BY 4.0): raster de
  altura a 0,5 m; por edificio se toma el percentil 80 dentro de la huella.

Lee y reescribe src/components/web-sections/edificio-3d/context/contextData.json
(campo 'buildings'); calles, canal y puentes quedan como los dejó el bake de OSM.
"""
import importlib.util
import json
import os

import duckdb
import numpy as np
import rasterio
from PIL import Image, ImageDraw
from pyproj import Transformer
from rasterio.windows import from_bounds

HERE = os.path.dirname(__file__)
spec = importlib.util.spec_from_file_location('osm', os.path.join(HERE, 'bake-osm-context.py'))
osm = importlib.util.module_from_spec(spec)
spec.loader.exec_module(osm)

RELEASE = '2026-10-21.0'
SPAN = 0.0075  # grados (~800 m) alrededor del lote
RADIUS = 800  # m: más lejos queda dentro de la niebla
MANIFEST = 'https://storage.googleapis.com/open-buildings-temporal-data/v1/manifests/95_EPSG_32720_2023_06_30.json'
TILES = 'https://storage.googleapis.com/open-buildings-temporal-data/v1/geotiffs/9'
GRID = 2.0  # m por píxel al leer el raster
FAR = 250  # m: más lejos, cada edificio se simplifica a su contorno convexo


def convex_hull(points):
    pts = sorted(set(points))
    if len(pts) < 3:
        return pts

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def footprints():
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs; INSTALL spatial; LOAD spatial; SET s3_region='us-west-2';")
    lat, lon = osm.LAT0, osm.LON0
    rows = con.execute(f"""
        SELECT ST_AsGeoJSON(geometry)
        FROM read_parquet('s3://overturemaps-us-west-2/release/{RELEASE}/theme=buildings/type=building/*',
                          hive_partitioning=1)
        WHERE bbox.xmin > {lon - SPAN} AND bbox.xmax < {lon + SPAN}
          AND bbox.ymin > {lat - SPAN} AND bbox.ymax < {lat + SPAN}
    """).fetchall()
    rings = []
    for (geojson,) in rows:
        g = json.loads(geojson)
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        rings += [p[0] for p in polys]
    return rings


def height_raster():
    to_utm = Transformer.from_crs(4326, 32720, always_xy=True)
    x, y = to_utm.transform(osm.LON0, osm.LAT0)
    manifest = json.load(open_url(MANIFEST))
    for source in manifest['tilesets'][0]['sources']:
        a = source['affineTransform']
        w = source['dimensions']['width'] * a['scaleX']
        h = source['dimensions']['height'] * -a['scaleY']
        if a['translateX'] <= x <= a['translateX'] + w and a['translateY'] - h <= y <= a['translateY']:
            url = TILES + source['uris'][0]
            break
    r = RADIUS + 100
    size = int(2 * r / GRID)
    with rasterio.open(url) as src:
        window = from_bounds(x - r, y - r, x + r, y + r, src.transform)
        height = src.read(2, window=window, out_shape=(size, size))
        presence = src.read(3, window=window, out_shape=(size, size))
    height[(presence < 0.5) | (height < 0)] = np.nan
    origin = (x - r, y + r)  # esquina superior izquierda en UTM
    return height, origin, to_utm


def open_url(url):
    import subprocess
    import io
    return io.BytesIO(subprocess.run(['curl', '-sf', url], check=True, capture_output=True).stdout)


def building_height(ring, raster, origin, to_utm):
    height, (ox, oy) = raster[0], origin
    pts = [to_utm.transform(lon, lat) for lon, lat in ring]
    px = [((x - ox) / GRID, (oy - y) / GRID) for x, y in pts]
    x0 = max(0, int(min(p[0] for p in px)))
    y0 = max(0, int(min(p[1] for p in px)))
    x1 = min(height.shape[1], int(max(p[0] for p in px)) + 2)
    y1 = min(height.shape[0], int(max(p[1] for p in px)) + 2)
    if x1 <= x0 or y1 <= y0:
        return None
    mask = Image.new('L', (x1 - x0, y1 - y0))
    ImageDraw.Draw(mask).polygon([(x - x0, y - y0) for x, y in px], fill=1)
    values = height[y0:y1, x0:x1][np.asarray(mask, bool)]
    values = values[~np.isnan(values)]
    if values.size < 2:
        return None
    return float(np.percentile(values, 80))


def main():
    rings = footprints()
    raster = height_raster()
    out = []
    for ring in rings:
        pts = [osm.to_local({'lon': lon, 'lat': lat}) for lon, lat in ring]
        if pts[0] == pts[-1]:
            pts = pts[:-1]
        cx = sum(p[0] for p in pts) / len(pts)
        cz = sum(p[1] for p in pts) / len(pts)
        if len(pts) < 3 or (cx * cx + (cz - 20) ** 2) ** 0.5 > RADIUS:
            continue
        measured = building_height(ring, raster, raster[1], raster[2])
        h = min(100.0, max(3.0, measured if measured else 6.0))
        pieces = [pts]
        for rect in osm.CLEAR_RECTS:
            pieces = [q for p in pieces for q in osm.subtract_rect(p, rect)]
        far = (cx * cx + (cz - 20) ** 2) ** 0.5 > FAR
        for p in pieces:
            if far:
                p = convex_hull(p)
                if len(p) < 3:
                    continue
            b = {'p': [[round(x, 1), round(z, 1)] for x, z in p], 'h': round(h, 1)}
            if far:
                b['far'] = 1
            out.append(b)
    path = osm.OUT
    data = json.load(open(path))
    data['buildings'] = out
    data['source'] = ('© OpenStreetMap contributors (ODbL); Overture Maps Foundation; '
                      'Google Open Buildings 2.5D (CC BY 4.0)')
    with open(path, 'w') as f:
        json.dump(data, f, separators=(',', ':'))
    hs = sorted(b['h'] for b in out)
    print(f'{len(out)} edificios; altura mediana {hs[len(hs) // 2]} m, máx {hs[-1]} m -> {os.path.normpath(path)}')


if __name__ == '__main__':
    main()
