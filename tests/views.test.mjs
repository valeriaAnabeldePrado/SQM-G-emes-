import assert from 'node:assert/strict'
import test from 'node:test'
import { lowForView } from '../src/components/web-sections/edificio-3d/scene/views.js'

test('the neighborhood lowers by itself only around the offices', () => {
  assert.equal(lowForView('contrafrente'), true)
  assert.equal(lowForView('piso:of1'), true)
  assert.equal(lowForView('piso:of0'), true)
  for (const view of ['general', 'frente', 'aerea', 'piso:5', 'piso:0']) {
    assert.equal(lowForView(view), false, view)
  }
})
