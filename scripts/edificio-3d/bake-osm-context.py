"""Genera el contexto urbano liviano para /edificio-3d a partir de OpenStreetMap.

Uso: python3 scripts/edificio-3d/bake-osm-context.py

Descarga edificios y calles alrededor de Av. Pueyrredón 377 (Overpass API),
los pasa a un sistema local en metros alineado con la avenida y escribe
src/components/web-sections/edificio-3d/context/contextData.json.

Sistema local: x a lo largo de Pueyrredón (hacia Belgrano), z hacia el fondo
del lote (Pje. Ángelo de Peredo), origen en el centro del frente del lote.
Datos © OpenStreetMap contributors (ODbL).
"""
import json
import math
import os
import subprocess
import time

LAT0, LON0 = -31.4258661, -64.1937064  # Av. Pueyrredón 377 (Nominatim)
RADIUS = 220
ROADS_RADIUS = 800  # calles hasta donde llegan los edificios de bake-heights.py
# Eje de la avenida medido sobre el tramo OSM frente al lote (-19.8°)
UX, UY = 0.9407883, -0.3389946
VX, VY = UY, -UX
FRONT_LINE_V = 2.7  # línea municipal sur de Pueyrredón (frentes OSM a v≈2.6-2.8)

LOT_HALF_W = 5.6
LOT_DEPTH = 40.5
# Zonas que se modelan a mano (lote + linderos reconstruidos desde Street View,
# sobre Pueyrredón y sobre Peredo; ver context/neighbors.js)
CLEAR_RECTS = [
    (-LOT_HALF_W, LOT_HALF_W, -1.0, LOT_DEPTH + 0.5),
    (LOT_HALF_W, 22.0, -1.0, 23.0),
    (-21.5, -LOT_HALF_W, -1.0, 22.0),
    (-29.6, -LOT_HALF_W, 22.0, LOT_DEPTH + 1.0),  # hasta la línea municipal sobre Alvear
    (LOT_HALF_W, 20.5, 23.0, LOT_DEPTH + 1.0),
]
# Calles que se dibujan desde la config del edificio (rectas, con veredas)
OWN_STREETS = {'Avenida Pueyrredón', 'Avenida J. M. de Pueyrredón', 'Ángelo de Peredo'}
CANAL_WIDTH = 14  # ancho entre muros (tag width de OSM)
CANAL_REACH = 260  # tramo de canal que se modela (m sobre el eje z)
ROAD_WIDTH = {'primary': 14, 'secondary': 11, 'tertiary': 9, 'residential': 7.5,
              'unclassified': 7, 'living_street': 6, 'service': 4}

OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'components',
                   'web-sections', 'edificio-3d', 'context', 'contextData.json')


def fetch():
    q = f"""[out:json][timeout:60];
(way(around:{RADIUS},{LAT0},{LON0})["building"];
 way(around:{ROADS_RADIUS},{LAT0},{LON0})["highway"];
 way(around:{RADIUS + 200},{LAT0},{LON0})["waterway"]["name"="Arroyo La Cañada"];);
out geom tags;"""
    # curl en lugar de urllib: el Python de macOS suele no tener certificados.
    # Overpass corta conexiones seguido: se reintenta con espera creciente.
    for attempt in range(4):
        result = subprocess.run(
            ['curl', '-sf', '-A', 'vivra-edificio-3d', '--data-urlencode', f'data={q}',
             'https://overpass-api.de/api/interpreter'],
            capture_output=True)
        if result.returncode == 0:
            return json.loads(result.stdout)['elements']
        time.sleep(5 * (attempt + 1))
    raise RuntimeError('Overpass no respondió después de 4 intentos')


def to_local(p):
    x = (p['lon'] - LON0) * 111320 * math.cos(math.radians(LAT0))
    y = (p['lat'] - LAT0) * 110540
    return (x * UX + y * UY, x * VX + y * VY - FRONT_LINE_V)


def clip(poly, axis, value, keep_greater):
    """Sutherland-Hodgman contra un semiplano alineado a los ejes."""
    out = []
    n = len(poly)
    for i in range(n):
        a, b = poly[i], poly[(i + 1) % n]
        ina = (a[axis] >= value) if keep_greater else (a[axis] <= value)
        inb = (b[axis] >= value) if keep_greater else (b[axis] <= value)
        if ina:
            out.append(a)
        if ina != inb:
            t = (value - a[axis]) / (b[axis] - a[axis])
            out.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return out


def subtract_rect(poly, rect):
    x0, x1, z0, z1 = rect
    pieces = [clip(poly, 0, x0, False), clip(poly, 0, x1, True)]
    mid = clip(clip(poly, 0, x0, True), 0, x1, False)
    if len(mid) >= 3:
        pieces += [clip(mid, 1, z0, False), clip(mid, 1, z1, True)]
    return [p for p in pieces if len(p) >= 3 and area(p) > 2]


def area(poly):
    return abs(sum(poly[i][0] * poly[(i + 1) % len(poly)][1] -
                   poly[(i + 1) % len(poly)][0] * poly[i][1]
                   for i in range(len(poly)))) / 2


def height(tags):
    if 'height' in tags:
        try:
            return float(tags['height'].split()[0])
        except ValueError:
            pass
    if 'building:levels' in tags:
        return float(tags['building:levels']) * 3 + 1
    # Sin dato en OSM: altura neutra, se muestra como maqueta de contexto
    return 6.0 if tags.get('building') == 'house' else 9.0


def canal_and_bridges(elements):
    """Eje de La Cañada en el tramo visible y los puentes que la cruzan.

    El arroyo corre encajonado entre las dos manos de Marcelo T. de Alvear; los
    puentes son las calles y pasarelas OSM marcadas bridge=yes que lo cruzan.
    """
    stream = next((e for e in elements if e.get('tags', {}).get('name') == 'Arroyo La Cañada'), None)
    if not stream:
        return None
    pts = [to_local(p) for p in stream['geometry']]
    axis = [p for p in pts if -CANAL_REACH <= p[1] <= CANAL_REACH]
    # Extiende el tramo hasta los bordes del área con el segmento vecino
    for edge in (-CANAL_REACH, CANAL_REACH):
        for a, b in zip(pts, pts[1:]):
            if (a[1] - edge) * (b[1] - edge) < 0:
                t = (edge - a[1]) / (b[1] - a[1])
                axis.append((a[0] + (b[0] - a[0]) * t, edge))
    axis.sort(key=lambda p: p[1])

    def axis_x(z):
        for a, b in zip(axis, axis[1:]):
            if a[1] <= z <= b[1]:
                t = (z - a[1]) / (b[1] - a[1] or 1)
                return a[0] + (b[0] - a[0]) * t
        return axis[0][0]

    spans = []
    for e in elements:
        tags = e.get('tags', {})
        if tags.get('bridge') != 'yes' or 'highway' not in tags:
            continue
        pts = [to_local(p) for p in e['geometry']]
        zs = [p[1] for p in pts]
        if not -CANAL_REACH < sum(zs) / len(zs) < CANAL_REACH:
            continue
        cx = axis_x(sum(zs) / len(zs))
        if min(p[0] for p in pts) < cx < max(p[0] for p in pts):
            spans.append([min(zs) - 1.0, max(zs) + 1.0])
    spans.sort()
    bridges = []
    for span in spans:
        if bridges and span[0] <= bridges[-1][1] + 6:  # calzada y pasarelas del mismo cruce
            bridges[-1][1] = max(bridges[-1][1], span[1])
        else:
            bridges.append(span)
    return {
        'axis': [[round(x, 1), round(z, 1)] for x, z in axis],
        'width': CANAL_WIDTH,
        'bridges': [[round(a, 1), round(b, 1)] for a, b in bridges],
    }


def main():
    elements = fetch()
    buildings, roads = [], []
    for el in elements:
        tags = el.get('tags', {})
        pts = [to_local(p) for p in el.get('geometry', [])]
        if 'building' in tags:
            if pts and pts[0] == pts[-1]:
                pts = pts[:-1]
            pieces = [pts]
            for rect in CLEAR_RECTS:
                pieces = [q for p in pieces for q in subtract_rect(p, rect)]
            for p in pieces:
                cx = sum(v[0] for v in p) / len(p)
                cz = sum(v[1] for v in p) / len(p)
                if math.hypot(cx, cz - 20) > 190:
                    continue
                buildings.append({
                    'p': [[round(x, 1), round(z, 1)] for x, z in p],
                    'h': round(height(tags), 1),
                    'known': 'height' in tags or 'building:levels' in tags,
                })
        elif tags.get('highway') in ROAD_WIDTH and tags.get('name') not in OWN_STREETS:
            # Ancho por carriles si OSM lo dice (las avenidas de mano única, como
            # Marcelo T. de Alvear junto a La Cañada, son más angostas que su clase)
            lanes = tags.get('lanes', '')
            width = int(lanes) * 3.2 + 1 if lanes.isdigit() else ROAD_WIDTH[tags['highway']]
            road = {'p': [[round(x, 1), round(z, 1)] for x, z in pts], 'w': width}
            if tags.get('name'):
                road['n'] = tags['name']  # para los carteles de calles
            roads.append(road)
    canal = canal_and_bridges(elements)
    with open(OUT, 'w') as f:
        json.dump({'source': '© OpenStreetMap contributors (ODbL)',
                   'buildings': buildings, 'roads': roads, 'canal': canal},
                  f, separators=(',', ':'))
    print(f'{len(buildings)} edificios, {len(roads)} calles, '
          f'{len(canal["bridges"]) if canal else 0} puentes -> {os.path.normpath(OUT)}')


if __name__ == '__main__':
    main()
