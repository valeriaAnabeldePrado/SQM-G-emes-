# Entrada tipo drone en /edificio-3d

## Intención

El 3D existe para vender unidades. Hoy se abre directo en la vista general, donde
VIVRA se confunde con los vecinos y el entorno no se cuenta. La entrada tiene que
hacer lo que hacen los videos de Maps/Earth: arrancar muy alto mirando la ciudad
desde arriba, bajar hasta la manzana, inclinarse para mostrar el entorno (Cañada,
plazoleta, Pocito) y aterrizar en VIVRA. Ahí el usuario pasa a elegir unidades.

Éxito: en los primeros 10 segundos el visitante entiende dónde está el edificio,
lo distingue del resto y queda frente al selector de pisos.

## Objetivos

- Vuelo de entrada de ~8 s desde ~6 km de altura hasta la vista general actual.
- Foto satelital real de Córdoba en el piso, visible desde arriba.
- VIVRA destacado sobre el barrio durante la bajada y el aterrizaje.
- Al aterrizar, invitación a elegir unidad sobre el selector de pisos.

## No objetivos

- Globo terráqueo ni vista desde el espacio (descartado: otro motor, clave paga).
- Cambiar el aspecto del barrio después del aterrizaje: se resuelve aparte si hace falta.
- Recorrido guiado por pisos o unidades.

## Anti-objetivos

- Que la entrada demore o trabe al que viene a ver una unidad: siempre se puede
  saltear y nunca bloquea la interacción.
- Depender de una cuenta, tarjeta o clave de un servicio externo.
- Usar imágenes con licencia no comercial.
- Empeorar la carga inicial o los cuadros por segundo de la vista general.

## Restricciones

- Sin cuenta ni tarjeta: la imagen se descarga una vez con un script y se guarda
  en el proyecto, como ya se hace con OpenStreetMap (`bake-osm-context.py`).
- Licencia: **Sentinel-2 cloudless 2016 de EOX** (CC BY 4.0, uso comercial con
  atribución). Las versiones 2018 en adelante, más nítidas, son CC BY-NC-SA (no
  comercial): no se usan. Atribución obligatoria en el pie: "Sentinel-2 cloudless
  – s2maps.eu by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016)".
- Resolución real 10 m por píxel: nítida desde arriba, borrosa cerca del suelo.
  Por debajo de unos 400 m el piso del barrio modelado (±800 m) reemplaza a la foto.
- El modelo de barrio cubre ±800 m; la foto tiene que cubrir lo que se ve desde la
  altura de arranque.
- La escena renderiza a demanda (`frameloop="demand"`): el vuelo invalida cada
  cuadro mientras dura y después vuelve al modo a demanda.
- Niebla actual de día 260–780 m: durante el vuelo se aleja para que se vea la foto.

## Enfoques considerados

1. Vuelo solo con el modelo existente (arranca a ~1.200 m, barrio como maqueta
   blanca). Sin descargas, pero no se siente como Maps.
2. **Elegido:** vuelo más foto satelital en el piso. Arranca más alto y se reconoce
   Córdoba real. Cuesta una imagen de menos de 1 MB y requiere licencia comercial
   (resuelto con Sentinel-2 2016, que no pide cuenta).
3. Globo real (Cesium o 3D de Google). Descartado: otro motor, clave con costo por
   visita y la ciudad fotorrealista choca con el modelo.

Dentro del enfoque 2, la fuente: Mapbox o Esri darían calidad de calle, pero
piden cuenta con tarjeta; el usuario no quiere poner tarjeta. IDECOR (ortofoto
oficial) no tiene una foto actual publicada que se haya podido encontrar.

## Diseño

### Imagen satelital (script, una vez)

`scripts/edificio-3d/bake-satellite.py` descarga teselas de EOX
(`tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg`)
alrededor de `LAT0, LON0` del script de OSM, las reproyecta al sistema local
(mismo giro de -19,8° de Pueyrredón y escala de `to_local`) y escribe una sola
imagen de 8 km de lado (lo que se ve desde 6 km de altura), 1024 px (~8 m por
píxel, la resolución real de la fuente), JPEG ≤ 700 KB en `public/edificio-3d/`.
Una segunda imagen más amplia no aporta: antes de que la cámara se incline la
niebla vuelve a su rango normal y tapa el borde.

### Piso satelital

Un plano con la foto apenas por encima del suelo del barrio. Desde arriba se ve
la foto completa. Dentro de los ±800 m del barrio modelado la foto se desvanece
según la altura de la cámara: foto arriba de ~600 m, barrio abajo de ~250 m. Fuera
de los ±800 m la foto queda. Solo existe durante el vuelo: después se descarta.

### Vuelo

- Arranque: cámara cenital a ~6 km sobre el lote, con el norte arriba como en Maps.
- Bajada con altura en escala logarítmica (como el zoom de un mapa), girando del
  norte al rumbo final de la vista general.
- Inclinación de cenital a la de la vista general en el último tercio, con un
  leve giro alrededor del edificio para mostrar el entorno.
- Termina exactamente en `homeView` de `CameraRig`, sin salto.
- Los edificios del barrio crecen desde el suelo entre ~1.500 m y ~300 m, con el
  mismo mecanismo que ya usa "Entorno bajo" (no suma costo de shader).
- Durante la bajada el barrio se ve en tono maqueta y VIVRA con sus materiales;
  al aterrizar el barrio vuelve a su aspecto actual.

### Interacción

- Se reproduce cada vez que se entra a `/edificio-3d`, cuando terminó la carga.
- Botón "Saltar" visible todo el vuelo. Clic, arrastre, rueda o tecla también
  saltan: la cámara va directo a la vista general.
- Con `prefers-reduced-motion` no hay vuelo.
- Al aterrizar, el selector de pisos se resalta unos segundos con "Elegí tu unidad".
- El precalentado de interiores (`Prewarm`) espera a que termine el vuelo, para
  no trabarlo.

### Créditos

Se agrega la atribución de Sentinel-2 al texto del pie en `ui/Overlay.jsx`.

## Decisiones tomadas por Claude (corregibles)

- Duración ~8 s, altura de arranque ~6 km, norte arriba al inicio.
- Se reproduce en cada visita, no solo en la primera.
- Los edificios crecen desde el suelo (reusa "Entorno bajo", sin costo extra).
- Durante el vuelo se ocultan la barra de horas, las vistas y el selector de pisos;
  queda el título y el botón "Saltar".
- Tono maqueta solo durante el vuelo.
- Imagen en `public/`, cargada en paralelo con la escena; sin vuelo no se descarga.

## Queda a criterio de quien implemente

- Curvas exactas de altura, giro e inclinación; umbrales de fundido.
- Cómo se alejan la niebla, el cielo y el plano lejano de la cámara durante el vuelo.
- Qué hacer en la calidad más baja si el vuelo no llega a 30 cuadros por segundo
  (acortarlo o saltearlo).

---

## Revisión 2026-11-16: sin foto satelital, barrio en maqueta permanente

Probado en el equipo del usuario: la foto Sentinel-2 se ve "rancia" al arrancar.
Un video desde arriba se descarta (difícil de hacer coincidir con el modelo y pesado).

### Enfoques considerados
1. Vuelo corto sobre el mapa del modelo, sin foto.
2. Sin vuelo, arrancar en el edificio con el barrio en tono maqueta siempre.
3. **Elegido:** las dos juntas: vuelo corto sobre el mapa del modelo y, al aterrizar,
   el barrio queda en tono maqueta para que VIVRA destaque.

### Cambios sobre el diseño anterior
- Se elimina la foto satelital: componente, imagen, script de horneado y crédito.
- Vuelo de ~5 s desde ~1.000 m (dentro del barrio modelado de ±800 m: no hace falta
  foto ni agrandar el cielo). El barrio arranca plano (huellas, como un mapa) y crece
  entre ~700 y ~200 m.
- El tono maqueta del barrio pasa a ser el aspecto normal de la escena, no solo del
  vuelo. Un solo valor (`MAQUETTE`) regula cuánto se apaga: de gris suave a blanco
  total, para ajustarlo mirándolo con el usuario. De noche el barrio se oscurece y
  VIVRA queda iluminado.
- VIVRA y sus materiales no cambian. Saltar, invitación y "reducir movimiento" quedan
  como están.
