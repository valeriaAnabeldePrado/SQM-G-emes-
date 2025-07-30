import React from 'react'

const ModelTen = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-dark)]">Modelo Ten</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold">Pisos:</span>
          <span>7mo al 10mo piso</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Superficie:</span>
          <span>85 m²</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Dormitorios:</span>
          <span>3</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Baños:</span>
          <span>2</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Balcón:</span>
          <span>Amplio balcón</span>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Departamento premium en pisos altos con vistas excepcionales y amplios espacios para el
            confort familiar.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ModelTen
