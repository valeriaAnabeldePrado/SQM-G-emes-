import React from 'react'
import BackToHome from '../../../buttons/BackToHome'
import ScrollApartmentOptimized from '../ScrollApartmentOptimized'

const ApartamentSection = () => {
  return (
    <div className="w-full">
      <BackToHome />
      <ScrollApartmentOptimized
        title="Explora tu futuro hogar"
        description="Descubre cada detalle de tu nuevo apartamento con nuestra experiencia inmersiva"
      />
    </div>
  )
}

export default ApartamentSection
