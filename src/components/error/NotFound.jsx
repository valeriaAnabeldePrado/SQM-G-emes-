import React from 'react'
import { Link } from 'react-router-dom'
import { MdHome, MdArrowBack } from 'react-icons/md'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[var(--color-one)] mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            <MdArrowBack className="mr-2" size={20} />
            Volver atrás
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[var(--color-one)] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
          >
            <MdHome className="mr-2" size={20} />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
