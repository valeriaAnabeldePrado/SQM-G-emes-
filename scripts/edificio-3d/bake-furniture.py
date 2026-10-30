"""Detecta mesas de comedor y camas en las plantas de /public/planos.

Uso: python3 scripts/edificio-3d/bake-furniture.py   (requiere numpy y Pillow)

Lee las mismas imágenes que /apartments (ver interiors/floorUnits.json) y
escribe interiors/floorFurniture.json con posiciones en píxeles de cada imagen:
  - tables:    [x, y, r]  mesas redondas (Hough de círculos con interior vacío)
  - beds:      [x0, y0, x1, y1, lado_cabecera]  camas (rectángulo de ~1,5 x 2 m)
  - fixtures:  [nombre, x0, y0, x1, y1, lado_muro]  inodoro, bidé, lavatorio,
               anafe, bacha, lavarropas (bloques de CAD buscados por correlación)
  - counters:  [x0, y0, x1, y1, lado_muro]  mesadas de cocina (salen de anafe y bacha)
La escena genera muebles livianos en esas posiciones.
"""
import json
import os
from collections import deque

import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
PUBLIC = os.path.join(ROOT, 'public')
INTERIORS = os.path.join(ROOT, 'src', 'components', 'web-sections', 'edificio-3d', 'interiors')
LOT_WIDTH = 11.0


def layers(path):
    a = np.asarray(Image.open(path).convert('RGBA')).astype(int)
    rgb, alpha = a[..., :3], a[..., 3]
    luma = rgb.mean(axis=2)
    neutral = np.abs(rgb[..., 0] - rgb[..., 2]) < 10
    wall = (alpha > 200) & (luma > 125) & (luma < 197) & neutral
    core = wall[:-1, :-1] & wall[1:, :-1] & wall[:-1, 1:] & wall[1:, 1:]
    walls = np.zeros_like(wall)
    for dy in (0, 1):
        for dx in (0, 1):
            walls[dy:dy + core.shape[0], dx:dx + core.shape[1]] |= core
    near_wall = walls.copy()
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            near_wall |= np.roll(np.roll(walls, dy, 0), dx, 1)
    furniture = (alpha > 200) & (luma < 215) & neutral & ~near_wall
    ys, _ = np.where(walls)
    scale = (ys.max() - ys.min()) / LOT_WIDTH
    return furniture, walls, scale


def components(mask):
    h, w = mask.shape
    seen = np.zeros((h, w), bool)
    out = []
    for y0, x0 in zip(*np.where(mask)):
        if seen[y0, x0]:
            continue
        q = deque([(y0, x0)])
        seen[y0, x0] = True
        x_min = x_max = x0
        y_min = y_max = y0
        while q:
            y, x = q.popleft()
            x_min, x_max, y_min, y_max = min(x_min, x), max(x_max, x), min(y_min, y), max(y_max, y)
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < h and 0 <= xx < w and mask[yy, xx] and not seen[yy, xx]:
                        seen[yy, xx] = True
                        q.append((yy, xx))
        out.append((int(x_min), int(y_min), int(x_max) + 1, int(y_max) + 1))
    return out


def round_tables(furniture, scale):
    """Hough de círculos de 0,45 a 0,56 m de radio; se quedan los de contorno
    casi completo e interior vacío (descarta textos, figuras y sanitarios)."""
    h, w = furniture.shape
    ys, xs = np.where(furniture)
    angles = np.linspace(0, 2 * np.pi, 48, endpoint=False)
    candidates = []
    for r in np.arange(0.45 * scale, 0.56 * scale, 1.0):
        acc = np.zeros((h, w), np.int32)
        for t in angles:
            cy = np.round(ys - r * np.sin(t)).astype(int)
            cx = np.round(xs - r * np.cos(t)).astype(int)
            ok = (cy >= 0) & (cy < h) & (cx >= 0) & (cx < w)
            np.add.at(acc, (cy[ok], cx[ok]), 1)
        smooth = sum(np.roll(np.roll(acc, dy, 0), dx, 1) for dy in (-1, 0, 1) for dx in (-1, 0, 1))
        for y, x in zip(*np.where(smooth >= 110)):
            candidates.append((int(x), int(y), float(r), int(smooth[y, x])))
    candidates.sort(key=lambda c: -c[3])
    yy, xx = np.ogrid[:h, :w]
    tables = []
    for x, y, r, _ in candidates:
        if any((x - t[0]) ** 2 + (y - t[1]) ** 2 < (0.9 * scale) ** 2 for t in tables):
            continue
        ring = 0
        for t in np.linspace(0, 2 * np.pi, 72, endpoint=False):
            for dr in (-1.5, -0.75, 0, 0.75, 1.5):
                px, py = int(round(x + (r + dr) * np.cos(t))), int(round(y + (r + dr) * np.sin(t)))
                if 0 <= px < w and 0 <= py < h and furniture[py, px]:
                    ring += 1
                    break
        inside = (xx - x) ** 2 + (yy - y) ** 2 <= (0.7 * r) ** 2
        if ring / 72 >= 0.7 and furniture[inside].mean() <= 0.05:
            tables.append([x, y, round(r, 1)])
    return tables


def inside(point, polygon):
    x, y = point
    hit = False
    for i in range(len(polygon)):
        x1, y1 = polygon[i]
        x2, y2 = polygon[(i + 1) % len(polygon)]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            hit = not hit
    return hit


def beds(furniture, walls, scale, polygons):
    """Camas: rectángulos con medida de cama, dentro de una unidad (descarta
    escaleras y núcleo), con un lado corto apoyado entero contra un muro y
    almohadones dibujados en esa franja (la cabecera). Ante la duda, no hay cama."""
    found = []
    band = 5
    pillow = int(0.45 * scale)
    for x0, y0, x1, y1 in components(furniture):
        w, h = (x1 - x0) / scale, (y1 - y0) / scale
        short, long = sorted((w, h))
        single = 0.78 <= short <= 1.0
        double = 1.35 <= short <= 1.8
        if not ((single or double) and 1.85 <= long <= 2.1):
            continue
        if not any(inside(((x0 + x1) / 2, (y0 + y1) / 2), p) for p in polygons):
            continue
        inner = furniture[y0 + 2:y1 - 2, x0 + 2:x1 - 2]
        if w > h:  # cama horizontal en la imagen: cabecera a izquierda o derecha
            sides = {
                'left': (walls[y0:y1, max(0, x0 - band):x0 + 1].any(axis=1).mean(), inner[:, :pillow].mean()),
                'right': (walls[y0:y1, x1 - 1:x1 + band].any(axis=1).mean(), inner[:, -pillow:].mean()),
            }
        else:
            sides = {
                'top': (walls[max(0, y0 - band):y0 + 1, x0:x1].any(axis=0).mean(), inner[:pillow, :].mean()),
                'bottom': (walls[y1 - 1:y1 + band, x0:x1].any(axis=0).mean(), inner[-pillow:, :].mean()),
            }
        head = [k for k, (wall, ink) in sides.items() if wall >= 0.85 and ink >= 0.12]
        if len(head) == 1:
            found.append([x0, y0, x1, y1, head[0]])
    return found


# Unidades con la misma tipología (mismo plano en /plantass) en distintas
# plantas. Cuando una cama se detecta en una, se replica en la misma posición
# relativa de las demás: en algunas plantas el dibujo de la cama queda pegado
# al placard y no se puede separar con seguridad.
SHARED_TYPOLOGIES = {
    'A': ['P1-5', 'P6', 'P7-10', 'P11-13'],
    'B': ['P1-5', 'P6', 'P7-10', 'P11-13'],
}


def bbox(points):
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    return min(xs), min(ys), max(xs), max(ys)


def share_beds(result, units):
    for letter, plans in SHARED_TYPOLOGIES.items():
        template = None
        for key in plans:
            box = bbox(units[key]['units'][letter][0])
            for bed in result[key]['beds']:
                x0, y0, x1, y1, head = bed
                if box[0] <= (x0 + x1) / 2 <= box[2] and box[1] <= (y0 + y1) / 2 <= box[3]:
                    w, h = box[2] - box[0], box[3] - box[1]
                    template = [(x0 - box[0]) / w, (y0 - box[1]) / h, (x1 - box[0]) / w, (y1 - box[1]) / h, head]
                    break
            if template:
                break
        if not template:
            continue
        for key in plans:
            box = bbox(units[key]['units'][letter][0])
            already = any(
                box[0] <= (b[0] + b[2]) / 2 <= box[2] and box[1] <= (b[1] + b[3]) / 2 <= box[3]
                for b in result[key]['beds']
            )
            if already:
                continue
            w, h = box[2] - box[0], box[3] - box[1]
            u0, v0, u1, v1, head = template
            result[key]['beds'].append(
                [round(box[0] + u0 * w), round(box[1] + v0 * h), round(box[0] + u1 * w), round(box[1] + v1 * h), head]
            )


# Bloques de CAD recortados de la planta de pisos 7 a 10 (x0, y0, x1, y1 en px).
# Las plantas los repiten idénticos; se buscan rotados, espejados y escalados.
TEMPLATE_PLAN = 'P7-10'
TEMPLATES = {
    'inodoro': (217, 300, 235, 313),
    'bide': (220, 318, 237, 331),
    'lavatorio': (165, 339, 182, 356),
    'anafe': (294, 335, 312, 346),
    'bacha': (296, 301, 309, 320),
    'lavarropas': (243, 313, 257, 329),
}
MATCH_THRESHOLD = 0.78
COUNTER_DEPTH = 0.6


def gray(path):
    im = Image.open(path).convert('RGBA')
    bg = Image.new('RGBA', im.size, (255, 255, 255, 255))
    bg.alpha_composite(im)
    return np.asarray(bg.convert('L')).astype(np.float32) / 255


def ncc(img, t):
    """Correlación cruzada normalizada (FFT + tablas de sumas). Las ventanas casi
    lisas se descartan: con varianza ~0 el cociente da puntajes espurios."""
    th, tw = t.shape
    H, W = img.shape
    t = t - t.mean()
    tn = np.sqrt((t * t).sum()) + 1e-6
    F = np.fft.rfft2(img, (H + th, W + tw))
    Ft = np.fft.rfft2(t[::-1, ::-1], (H + th, W + tw))
    corr = np.fft.irfft2(F * Ft, (H + th, W + tw))[th - 1:H, tw - 1:W]
    S = np.pad(img, ((1, 0), (1, 0))).cumsum(0).cumsum(1)
    S2 = np.pad(img * img, ((1, 0), (1, 0))).cumsum(0).cumsum(1)

    def box(A):
        return A[th:, tw:] - A[:-th, tw:] - A[th:, :-tw] + A[:-th, :-tw]

    n = th * tw
    m = box(S) / n
    v = box(S2) - n * m * m
    out = corr[:m.shape[0], :m.shape[1]] / (tn * np.sqrt(np.maximum(v, 1e-6)))
    out[v < 0.3 * tn * tn] = 0
    return out


def find_blocks(img, scale, templates, polygons):
    found = []
    for name, (t, t_scale) in templates.items():
        r = scale / t_scale
        size = (max(3, round(t.shape[1] * r)), max(3, round(t.shape[0] * r)))
        t = np.asarray(Image.fromarray((t * 255).astype(np.uint8)).resize(size, Image.BILINEAR))
        t = t.astype(np.float32) / 255
        threshold = MATCH_THRESHOLD
        for flip in (False, True):
            base = t[:, ::-1] if flip else t
            for k in range(4):
                tv = np.rot90(base, k)
                c = ncc(img, tv)
                for y, x in zip(*np.where(c >= threshold)):
                    cx, cy = x + tv.shape[1] / 2, y + tv.shape[0] / 2
                    if any(inside((cx, cy), p) for p in polygons):
                        found.append((float(c[y, x]), name, int(x), int(y), int(x + tv.shape[1]), int(y + tv.shape[0])))
    # Supresión de no-máximos entre todos los bloques (inodoro y bidé se parecen)
    found.sort(reverse=True)
    keep = []
    for f in found:
        _, name, x0, y0, x1, y1 = f
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        if all(abs(cx - (k[2] + k[4]) / 2) > (x1 - x0) * 0.6 or abs(cy - (k[3] + k[5]) / 2) > (y1 - y0) * 0.6 for k in keep):
            keep.append(f)
    return keep


def wall_side(walls, x0, y0, x1, y1, reach):
    """Lado del rectángulo con muro más cerca (hasta `reach` px): ahí va el respaldo."""
    h, w = walls.shape
    best, side = reach + 1, None
    for name, probe in (
        ('left', lambda d: walls[y0:y1, max(0, x0 - d)].any()),
        ('right', lambda d: walls[y0:y1, min(w - 1, x1 + d)].any()),
        ('top', lambda d: walls[max(0, y0 - d), x0:x1].any()),
        ('bottom', lambda d: walls[min(h - 1, y1 + d), x0:x1].any()),
    ):
        for d in range(0, reach + 1):
            if probe(d):
                if d < best:
                    best, side = d, name
                break
    return side, best


def against_wall(rect, side, gap, depth):
    """Rectángulo de `depth` px apoyado en el muro del lado `side`."""
    x0, y0, x1, y1 = rect
    if side == 'left':
        return [x0 - gap, y0, x0 - gap + depth, y1]
    if side == 'right':
        return [x1 + gap - depth, y0, x1 + gap, y1]
    if side == 'top':
        return [x0, y0 - gap, x1, y0 - gap + depth]
    return [x0, y1 + gap - depth, x1, y1 + gap]


def merge_runs(items, scale, max_gap):
    """Une rectángulos apoyados en el mismo muro y en fila (mesadas)."""
    merged = []
    for rect, side in sorted(items, key=lambda it: (it[1], it[0][1], it[0][0])):
        horizontal = side in ('top', 'bottom')
        for m in merged:
            mr, ms = m
            if ms != side:
                continue
            if horizontal and abs(mr[1] - rect[1]) <= 3 and rect[0] - mr[2] <= max_gap * scale and mr[0] - rect[2] <= max_gap * scale:
                m[0] = [min(mr[0], rect[0]), min(mr[1], rect[1]), max(mr[2], rect[2]), max(mr[3], rect[3])]
                break
            if not horizontal and abs(mr[0] - rect[0]) <= 3 and rect[1] - mr[3] <= max_gap * scale and mr[1] - rect[3] <= max_gap * scale:
                m[0] = [min(mr[0], rect[0]), min(mr[1], rect[1]), max(mr[2], rect[2]), max(mr[3], rect[3])]
                break
        else:
            merged.append([list(rect), side])
    return [[int(v) for v in r] + [sd] for r, sd in merged]


def fixtures_and_counters(path, walls, scale, polygons, templates):
    img = gray(path)
    blocks = find_blocks(img, scale, templates, polygons)
    fixtures, counter_parts = [], []
    reach = int(0.45 * scale)
    for _, name, x0, y0, x1, y1 in blocks:
        side, gap = wall_side(walls, x0, y0, x1, y1, reach)
        if side is None:
            continue
        fixtures.append([name, x0, y0, x1, y1, side])
        if name in ('anafe', 'bacha', 'lavarropas'):
            pad = int(0.15 * scale)
            grown = (x0 - pad, y0, x1 + pad, y1) if side in ('top', 'bottom') else (x0, y0 - pad, x1, y1 + pad)
            counter_parts.append((against_wall(grown, side, gap, int(COUNTER_DEPTH * scale)), side))
    return fixtures, merge_runs(counter_parts, scale, 1.2)


def main():
    units = json.load(open(os.path.join(INTERIORS, 'floorUnits.json')))['floors']
    source = os.path.join(PUBLIC, units[TEMPLATE_PLAN]['image'].lstrip('/'))
    _, _, source_scale = layers(source)
    source_img = gray(source)
    templates = {n: (source_img[y0:y1, x0:x1], source_scale) for n, (x0, y0, x1, y1) in TEMPLATES.items()}
    result = {}
    for key, plan in units.items():
        furniture, walls, scale = layers(os.path.join(PUBLIC, plan['image'].lstrip('/')))
        polygons = [p for ps in plan['units'].values() for p in ps]
        path = os.path.join(PUBLIC, plan['image'].lstrip('/'))
        fixtures, counters = fixtures_and_counters(path, walls, scale, polygons, templates)
        result[key] = {
            'tables': round_tables(furniture, scale),
            'beds': beds(furniture, walls, scale, polygons),
            'fixtures': fixtures,
            'counters': counters,
        }
        r = result[key]
        print(key, len(r['tables']), 'mesas', len(r['beds']), 'camas', len(r['fixtures']), 'artefactos',
              len(r['counters']), 'mesadas')
    share_beds(result, units)
    for key in result:
        print(key, len(result[key]['beds']), 'camas tras replicar tipologías')
    with open(os.path.join(INTERIORS, 'floorFurniture.json'), 'w') as f:
        json.dump(result, f, separators=(',', ':'))


if __name__ == '__main__':
    main()
