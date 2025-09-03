import React from 'react'
import { MdHome, MdRefresh } from 'react-icons/md'

class ReactErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary capturó un error:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-3xl font-bold">⚠</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Error de la aplicación</h1>
              <p className="text-gray-600 mb-4">
                Ha ocurrido un error inesperado en la aplicación.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-[var(--color-one)] text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
              >
                <MdRefresh className="mr-2" size={18} />
                Recargar página
              </button>

              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <MdHome className="mr-2" size={18} />
                Ir al inicio
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Detalles del error (desarrollo)
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-800 overflow-auto max-h-48">
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2">{this.state.errorInfo.componentStack}</pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ReactErrorBoundary
