import React, { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import Button from './button'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const toastTimer = useRef(null)
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' })

  const showToast = (message, type = 'info', duration = 4000) => {
    // clear previous timer
    if (toastTimer.current) {
      clearTimeout(toastTimer.current)
      toastTimer.current = null
    }
    setToast({ visible: true, message, type })
    toastTimer.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }))
      toastTimer.current = null
    }, duration)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      showToast('Por favor completa todos los campos obligatorios.', 'error')
      setIsSubmitting(false)
      return
    }

    try {
      // Configuración EmailJS desde variables de entorno (Vite)
      const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE || 'service_sux1wqg'
      const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE || 'template_25yviek'
      const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC || 'fcgrcFrPPV6ApVd1d'

      // extraer utm_source si existe
      let utm = ''
      try {
        const params =
          typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        utm = params ? params.get('utm_source') || '' : ''
      } catch {
        utm = ''
      }

      // Construir payload que coincide con el template HTML
      const templateParams = {
        from_name: formData.nombre,
        reply_to: formData.email,
        phone: formData.telefono || '—',
        message: formData.mensaje,
        page: typeof window !== 'undefined' ? window.location.pathname : 'site',
        utm_source: utm,
        datetime: new Date().toLocaleString(),
        to_email: 'vivraguemes@gmail.com'
      }

      // Enviar email
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)

      const successMsg = '¡Mensaje enviado correctamente! Te contactaremos pronto.'
      showToast(successMsg, 'success')

      // Limpiar formulario
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
    } catch (error) {
      console.error('Error sending email:', error)
      const errMsg = 'Hubo un error al enviar el mensaje. Intenta nuevamente.'
      showToast(errMsg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style jsx>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px transparent inset !important;
          -webkit-text-fill-color: var(--color-three) !important;
          background-color: transparent !important;
          background: transparent !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      <form
        onSubmit={handleSubmit}
        className="w-full  mx-auto min-note:pt-10 pt-4 flex flex-col gap-2 min-note:gap-4 rounded"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Apellido y Nombre *"
          value={formData.nombre}
          onChange={handleChange}
          className="bg-transparent autofill:bg-transparent focus:bg-transparent border-b-2 border-[var(--color-three)] outline-none placeholder-[var(--color-three)] text-p font-medium py-2 text-[var(--color-three)]"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Mail *"
          value={formData.email}
          onChange={handleChange}
          className="bg-transparent autofill:bg-transparent focus:bg-transparent border-b-2 border-[var(--color-three)] outline-none placeholder-[var(--color-three)] text-p font-medium py-2 text-[var(--color-three)]"
          required
        />
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          className="bg-transparent autofill:bg-transparent focus:bg-transparent border-b-2 border-[var(--color-three)] outline-none placeholder-[var(--color-three)] text-p font-medium py-2 text-[var(--color-three)]"
        />
        <textarea
          name="mensaje"
          placeholder="Mensaje *"
          value={formData.mensaje}
          onChange={handleChange}
          className="bg-transparent autofill:bg-transparent focus:bg-transparent border-b-2 border-[var(--color-three)] outline-none placeholder-[var(--color-three)] text-p font-medium py-2 resize-none text-[var(--color-three)]"
          rows={3}
          required
        ></textarea>{' '}
        {/* Mensaje de estado (se muestra ahora como toast) */}
        <Button type="submit" className={'mt-4 min-note:mt-10 '} disabled={isSubmitting}>
          <p className="m-auto">{isSubmitting ? 'Enviando...' : 'Enviar formulario'}</p>
        </Button>
      </form>
      {/* Toast (fixed bottom-left) */}
      <div aria-live="polite" className="fixed bottom-4 left-4 pointer-events-none z-50">
        {toast.visible && (
          <div
            role="status"
            className={`pointer-events-auto max-w-sm bg-opacity-95 text-white shadow-lg rounded-lg p-3 border ${
              toast.type === 'success'
                ? 'bg-emerald-600 border-emerald-700'
                : 'bg-rose-600 border-rose-700'
            } transform transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 text-sm leading-tight">{toast.message}</div>
              <button
                aria-label="Cerrar"
                onClick={() => setToast((t) => ({ ...t, visible: false }))}
                className="text-white opacity-90 hover:opacity-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ContactForm
