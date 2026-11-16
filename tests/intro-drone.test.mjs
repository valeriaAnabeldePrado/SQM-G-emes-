import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { SATELLITE } from '../src/components/web-sections/edificio-3d/context/satellite.js'

/** Alto y ancho de un JPEG (marcadores SOF0 / SOF2). */
function jpegSize(bytes) {
  let i = 2
  while (i < bytes.length) {
    if (bytes[i] !== 0xff) throw new Error('JPEG inválido')
    const marker = bytes[i + 1]
    const length = bytes.readUInt16BE(i + 2)
    if (marker === 0xc0 || marker === 0xc2) {
      return { height: bytes.readUInt16BE(i + 5), width: bytes.readUInt16BE(i + 7) }
    }
    i += 2 + length
  }
  throw new Error('sin SOF')
}

test('satellite image is baked, square and light', () => {
  assert.equal(SATELLITE.size, 8000)
  const file = new URL('../public' + SATELLITE.url, import.meta.url)
  const bytes = fs.readFileSync(file)
  assert.ok(bytes.length <= 700 * 1024, `${bytes.length} bytes`)
  assert.deepEqual(jpegSize(bytes), { width: 1024, height: 1024 })
})
