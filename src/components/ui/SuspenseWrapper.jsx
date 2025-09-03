import React, { Suspense } from 'react'

const LoadingFallback = ({ message = 'Cargando...' }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-one)] mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
)

const SuspenseWrapper = ({ children, fallback }) => (
  <Suspense fallback={fallback || <LoadingFallback />}>{children}</Suspense>
)

export { LoadingFallback, SuspenseWrapper }
export default SuspenseWrapper
