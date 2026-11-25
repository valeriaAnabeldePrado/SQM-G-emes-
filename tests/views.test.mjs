import assert from 'node:assert/strict'
import test from 'node:test'
import { ENTRY_HOUR, ENTRY_VIEW } from '../src/components/web-sections/edificio-3d/scene/views.js'

test('the page opens on the offices view at 18 h', () => {
  assert.equal(ENTRY_VIEW, 'contrafrente')
  assert.equal(ENTRY_HOUR, 18)
})
