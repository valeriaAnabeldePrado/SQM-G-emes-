import React, { useState } from 'react'
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
  const [submitStatus, setSubmitStatus] = useState('')

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
    setSubmitStatus('')

    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      setSubmitStatus('Por favor completa todos los campos obligatorios.')
      setIsSubmitting(false)
      return
    }

    try {
      // Configuración EmailJS (reemplazar con tus IDs reales)
      const SERVICE_ID = 'your_service_id'
      const TEMPLATE_ID = 'your_template_id'
      const PUBLIC_KEY = 'your_public_key'

      // Parámetros del template
      const templateParams = {
        from_name: formData.nombre,
        from_email: formData.email,
        phone: formData.telefono,
        message: formData.mensaje,
        to_name: 'VIVRA Güemes' // nombre del destinatario
      }

      // Enviar email
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)

      setSubmitStatus('¡Mensaje enviado correctamente! Te contactaremos pronto.')

      // Limpiar formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      })
    } catch (error) {
      console.error('Error sending email:', error)
      setSubmitStatus('Hubo un error al enviar el mensaje. Intenta nuevamente.')
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
        {/* Mensaje de estado */}
        {submitStatus && (
          <div
            className={`text-sm text-center py-2 ${
              submitStatus.includes('correctamente') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {submitStatus}
          </div>
        )}
        <Button type="submit" className={'mt-4 min-note:mt-10 '} disabled={isSubmitting}>
          <p className="m-auto">{isSubmitting ? 'Enviando...' : 'Enviar formulario'}</p>
        </Button>
      </form>
    </>
  )
}

export default ContactForm
