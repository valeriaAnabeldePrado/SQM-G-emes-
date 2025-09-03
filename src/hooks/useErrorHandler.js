import { useState, useEffect } from 'react'

export function useErrorHandler() {
  const [error, setError] = useState(null)

  const resetError = () => setError(null)

  const handleError = (error) => {
    console.error('Error capturado por useErrorHandler:', error)
    setError(error)
  }

  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      console.error('Promesa rechazada no manejada:', event.reason)
      handleError(event.reason)
    }

    const handleError = (event) => {
      console.error('Error global:', event.error)
      setError(event.error)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return { error, resetError, handleError }
}

export default useErrorHandler
