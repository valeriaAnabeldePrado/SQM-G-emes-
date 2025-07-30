import React from 'react'

const ModelFive = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-dark)]">Modelo Five</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold">Pisos:</span>
          <span>5to y 6to piso</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Superficie:</span>
          <span>65 m²</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Dormitorios:</span>
          <span>2</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Baños:</span>
          <span>2</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Balcón:</span>
          <span>Sí</span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Departamento de diseño moderno con excelente iluminación natural y vista panorámica de
            la ciudad.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ModelFive
