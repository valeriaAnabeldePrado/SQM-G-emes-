import React, { useState } from 'react'
import Button from './button'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Datos del formulario:', formData)

    // Aquí podrías enviar los datos (ej. con fetch o emailjs)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full  mx-auto min-note:pt-10 pt-4 flex flex-col gap-2 min-note:gap-4 rounded"
    >
      <input
        type="text"
        name="nombre"
        placeholder="Apellido y Nombre"
        value={formData.nombre}
        onChange={handleChange}
        className="bg-transparent autofill:bg-transparent focus:bg-transparent border-b-2 border-[var(--color-three)] outline-none placeholder-[var(--color-three)] text-p font-medium py-2"
      />
      <input
        type="email"
        name="email"
        placeholder="Mail"
        value={formData.email}
        onChange={handleChange}
        className="bg-transparent border-b-2 border-[var(--color-three)] outline-none placeholder-[var(--color-three)] text-p font-medium py-2"
      />
      <input
        type="tel"
        name="telefono"
        placeholder="Teléfono"
        value={formData.telefono}
        onChange={handleChange}
        className="bg-transparent border-b-2 border-[var(--color-three)] outline-none placeholder-[var(--color-three)] text-p font-medium py-2"
      />
      <textarea
        name="mensaje"
        placeholder="Mensaje"
        value={formData.mensaje}
        onChange={handleChange}
        className="bg-transparent border-b-2 border-[var(--color-three)] outline-none placeholder-[var(--color-three)] text-p font-medium py-2 resize-none"
        rows={3}
      ></textarea>
      <Button type="submit" className={'mt-4 min-note:mt-10 '}>
        <p className="m-auto">Enviar formulario</p>
      </Button>
    </form>
  )
}

export default ContactForm
