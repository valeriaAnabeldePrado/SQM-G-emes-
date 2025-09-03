import React from 'react'
import { useRouteError, Link } from 'react-router-dom'
import { MdHome, MdRefresh } from 'react-icons/md'

export default function ErrorBoundary() {
  const error = useRouteError()

  console.error('Error capturado:', error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-3xl font-bold">!</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ups! Algo salió mal</h1>
          <p className="text-gray-600 mb-4">
            {error?.status === 404
              ? 'La página que buscas no existe.'
              : 'Ha ocurrido un error inesperado.'}
          </p>
        </div>

        {error?.status === 404 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>Página no encontrada:</strong> {error?.data || 'Recurso no disponible'}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[var(--color-one)] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
          >
            <MdRefresh className="mr-2" size={18} />
            Recargar
          </button>

          <Link
            to="/"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            <MdHome className="mr-2" size={18} />
            Ir al inicio
          </Link>
        </div>

        {import.meta.env.DEV && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Detalles del error (desarrollo)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-800 overflow-auto">
              <pre>{error.message}</pre>
              {error.stack && <pre className="mt-2 text-xs">{error.stack}</pre>}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
