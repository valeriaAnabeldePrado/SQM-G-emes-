import nodemailer from 'nodemailer'
import { handleContact, smtpTransport } from './_lib/contacto.js'

/** POST /api/contacto { nombre, email, telefono?, mensaje, page?, utm_source? } -> { ok } */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Método no permitido' })
  }
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = null
    }
  }
  const { status, json } = await handleContact(body, process.env, () =>
    smtpTransport(nodemailer, process.env)
  )
  res.status(status).json(json)
}
