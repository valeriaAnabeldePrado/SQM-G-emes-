// Formulario de contacto: valida la consulta y la envía por SMTP (Google
// Workspace) desde la casilla SMTP_USER. Se mandan dos mails:
//   1. el lead, a la misma casilla, con "Responder" apuntando al visitante;
//   2. una confirmación al visitante de que la consulta llegó.
// Solo el primero es imprescindible: si falla la confirmación, la consulta
// igual cuenta como enviada.

const SMTP_HOST = 'smtp.gmail.com'
const SMTP_PORT = 587
const BRAND = 'Vivra Güemes'

const LIMITS = { nombre: 120, email: 200, telefono: 50, mensaje: 5000, page: 200, utm_source: 100 }
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const oneLine = (v) => v.replace(/[\r\n]+/g, ' ')
const escapeHtml = (v) =>
  v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** Valida y normaliza el cuerpo del POST. `website` es un campo trampa para bots. */
export function parseContact(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Datos inválidos' }
  if (clean(body.website, 200)) return { ok: false, spam: true }

  const data = Object.fromEntries(Object.entries(LIMITS).map(([k, max]) => [k, clean(body[k], max)]))
  if (!data.nombre || !data.email || !data.mensaje) {
    return { ok: false, error: 'Faltan campos obligatorios' }
  }
  if (!EMAIL_RE.test(data.email)) return { ok: false, error: 'Mail inválido' }
  return { ok: true, data }
}

/** Mail con la consulta, para la casilla de la empresa. */
export function buildLeadMail(data, { from, now = new Date() }) {
  const fecha = now.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
  const rows = [
    ['Nombre', data.nombre],
    ['Mail', data.email],
    ['Teléfono', data.telefono || '—'],
    ['Mensaje', data.mensaje],
    ['Página', data.page || '—'],
    ['Origen (utm_source)', data.utm_source || '—'],
    ['Fecha', fecha]
  ]
  return {
    from: `"Web ${BRAND}" <${from}>`,
    to: from,
    replyTo: data.email,
    subject: `Nueva consulta web — ${oneLine(data.nombre)}`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    html:
      `<h2>Nueva consulta desde la web de ${BRAND}</h2><table cellpadding="6">` +
      rows
        .map(
          ([k, v]) =>
            `<tr><td valign="top"><b>${k}</b></td><td>${escapeHtml(v).replace(/\n/g, '<br>')}</td></tr>`
        )
        .join('') +
      '</table><p>Respondé este mail para contestarle directamente.</p>'
  }
}

/**
 * Confirmación para el visitante. No repite el mensaje que escribió: así el
 * formulario no sirve para mandar texto arbitrario a terceros desde la casilla.
 */
export function buildConfirmationMail(data, { from }) {
  const nombre = oneLine(data.nombre).slice(0, 60)
  const text =
    `Hola ${nombre},\n\n` +
    `Gracias por escribirnos. Recibimos tu consulta sobre ${BRAND} y te vamos a responder a la brevedad.\n\n` +
    `Si querés sumar algo, respondé este mail.\n\n` +
    `Equipo ${BRAND}`
  return {
    from: `"${BRAND}" <${from}>`,
    to: data.email,
    replyTo: from,
    subject: `Recibimos tu consulta — ${BRAND}`,
    text,
    html: text
      .split('\n\n')
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('')
  }
}

export const smtpTransport = (nodemailer, env) =>
  nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  })

/**
 * Procesa una consulta. `createTransport()` devuelve algo con `sendMail`
 * (nodemailer en producción, uno falso en los tests).
 * @returns {Promise<{ status: number, json: object }>}
 */
export async function handleContact(body, env, createTransport) {
  const parsed = parseContact(body)
  // A los bots se les responde ok para que no reintenten
  if (parsed.spam) return { status: 200, json: { ok: true } }
  if (!parsed.ok) return { status: 400, json: { ok: false, error: parsed.error } }

  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.error('[contacto] Faltan SMTP_USER / SMTP_PASS')
    return { status: 500, json: { ok: false, error: 'Envío no configurado' } }
  }

  const transport = createTransport()
  const from = env.SMTP_USER
  try {
    await transport.sendMail(buildLeadMail(parsed.data, { from }))
  } catch (err) {
    console.error('[contacto] Falló el envío del lead:', err?.message)
    return { status: 502, json: { ok: false, error: 'No se pudo enviar la consulta' } }
  }

  try {
    await transport.sendMail(buildConfirmationMail(parsed.data, { from }))
  } catch (err) {
    console.error('[contacto] Lead enviado, falló la confirmación:', err?.message)
  }
  return { status: 200, json: { ok: true } }
}
