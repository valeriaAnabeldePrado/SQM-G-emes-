import assert from 'node:assert/strict'
import test from 'node:test'
import {
  parseContact,
  buildLeadMail,
  buildConfirmationMail,
  handleContact
} from '../api/_lib/contacto.js'

const valid = {
  nombre: '  Pérez, Ana ',
  email: ' ana@example.com ',
  telefono: '351 555-1234',
  mensaje: 'Quiero info del 2 ambientes',
  page: '/departamentos',
  utm_source: 'instagram'
}

const env = { SMTP_USER: 'marketing@juarezbeltran.com.ar', SMTP_PASS: 'x' }

/** Transporte falso: guarda lo que se "envía" y puede fallar a pedido. */
function fakeTransport({ failOn } = {}) {
  const sent = []
  return {
    sent,
    create: () => ({
      sendMail: async (mail) => {
        if (failOn?.(mail)) throw new Error('smtp caído')
        sent.push(mail)
        return { messageId: 'id' }
      }
    })
  }
}

test('parseContact limpia espacios y acepta una consulta completa', () => {
  const r = parseContact(valid)
  assert.equal(r.ok, true)
  assert.equal(r.data.nombre, 'Pérez, Ana')
  assert.equal(r.data.email, 'ana@example.com')
})

test('parseContact rechaza faltantes y mails inválidos', () => {
  assert.equal(parseContact({ ...valid, nombre: ' ' }).ok, false)
  assert.equal(parseContact({ ...valid, mensaje: '' }).ok, false)
  assert.equal(parseContact({ ...valid, email: 'no-es-mail' }).ok, false)
  assert.equal(parseContact(null).ok, false)
})

test('parseContact marca como spam si viene el campo trampa', () => {
  const r = parseContact({ ...valid, website: 'http://spam' })
  assert.equal(r.ok, false)
  assert.equal(r.spam, true)
})

test('el mail del lead va a la casilla de envío y se responde al visitante', () => {
  const { data } = parseContact(valid)
  const mail = buildLeadMail(data, { from: env.SMTP_USER })
  assert.equal(mail.to, env.SMTP_USER)
  assert.equal(mail.replyTo, 'ana@example.com')
  assert.match(mail.subject, /Pérez, Ana/)
  for (const v of ['351 555-1234', 'Quiero info del 2 ambientes', '/departamentos', 'instagram']) {
    assert.ok(mail.text.includes(v), `falta ${v} en el texto`)
  }
})

test('el mail del lead escapa HTML y no permite saltos de línea en el asunto', () => {
  const { data } = parseContact({ ...valid, nombre: 'Ana\r\nBcc: x@y.com', mensaje: '<script>x</script>' })
  const mail = buildLeadMail(data, { from: env.SMTP_USER })
  assert.doesNotMatch(mail.subject, /[\r\n]/)
  assert.ok(!mail.html.includes('<script>'))
  assert.ok(mail.html.includes('&lt;script&gt;'))
})

test('la confirmación va al visitante, sale de la casilla y no repite su mensaje', () => {
  const { data } = parseContact(valid)
  const mail = buildConfirmationMail(data, { from: env.SMTP_USER })
  assert.equal(mail.to, 'ana@example.com')
  assert.equal(mail.replyTo, env.SMTP_USER)
  assert.ok(!mail.text.includes(valid.mensaje))
  assert.ok(!mail.html.includes(valid.mensaje))
})

test('handleContact envía el lead y la confirmación', async () => {
  const t = fakeTransport()
  const r = await handleContact(valid, env, t.create)
  assert.equal(r.status, 200)
  assert.deepEqual(t.sent.map((m) => m.to), [env.SMTP_USER, 'ana@example.com'])
})

test('si falla la confirmación, la consulta igual cuenta como enviada', async () => {
  const t = fakeTransport({ failOn: (m) => m.to === 'ana@example.com' })
  const r = await handleContact(valid, env, t.create)
  assert.equal(r.status, 200)
  assert.equal(t.sent.length, 1)
})

test('si falla el lead, responde error', async () => {
  const t = fakeTransport({ failOn: (m) => m.to === env.SMTP_USER })
  const r = await handleContact(valid, env, t.create)
  assert.equal(r.status, 502)
})

test('spam: responde ok sin enviar nada', async () => {
  const t = fakeTransport()
  const r = await handleContact({ ...valid, website: 'x' }, env, t.create)
  assert.equal(r.status, 200)
  assert.equal(t.sent.length, 0)
})

test('sin credenciales SMTP responde error sin intentar enviar', async () => {
  const t = fakeTransport()
  const r = await handleContact(valid, {}, t.create)
  assert.equal(r.status, 500)
  assert.equal(t.sent.length, 0)
})

test('datos inválidos responden 400', async () => {
  const t = fakeTransport()
  const r = await handleContact({ ...valid, email: 'x' }, env, t.create)
  assert.equal(r.status, 400)
})
