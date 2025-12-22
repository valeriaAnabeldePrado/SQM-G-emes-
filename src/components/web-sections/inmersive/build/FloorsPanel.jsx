import { useState } from 'react'
import { departamentosData } from './constant'

export function FloorsPanel({ onFloorSelect }) {
  const [expandedFloor, setExpandedFloor] = useState(null)

  // Estructura de pisos
  const floors = [
    { key: 'PB', label: 'PB', name: 'Planta Baja' },
    { key: 'P1', label: 'P01', name: 'Piso 01' },
    { key: 'P2', label: 'P02', name: 'Piso 02' },
    { key: 'P3', label: 'P03', name: 'Piso 03' },
    { key: 'P4', label: 'P04', name: 'Piso 04' },
    { key: 'P5', label: 'P05', name: 'Piso 05' },
    { key: 'P6', label: 'P06', name: 'Piso 06' },
    { key: 'P7', label: 'P07', name: 'Piso 07' },
    { key: 'P8', label: 'P08', name: 'Piso 08' },
    { key: 'P9', label: 'P09', name: 'Piso 09' },
    { key: 'P10', label: 'P10', name: 'Piso 10' },
    { key: 'P11', label: 'P11', name: 'Piso 11' },
    { key: 'P12', label: 'P12', name: 'Piso 12' },
    { key: 'P13', label: 'P13', name: 'Piso 13' },
    { key: 'P14', label: 'P14', name: 'Piso 14' },
    { key: 'P15', label: 'P15', name: 'Piso 15' }
  ]

  const handleUnitClick = (floorKey, unit) => {
    onFloorSelect({
      ...unit,
      piso: floorKey,
      meshName: `${floorKey}_reference`
    })
  }

  const toggleFloor = (floorKey) => {
    setExpandedFloor(expandedFloor === floorKey ? null : floorKey)
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: window.innerWidth < 1024 ? 'none' : 'block' // Solo en desktop
      }}
    >
      <div
        style={{
          background: 'rgba(255, 252, 249, 0.7)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(226, 216, 206, 0.3)',
          borderLeft: 'none',
          borderRadius: '0 12px 12px 0',
          maxHeight: '90vh',
          overflowY: 'auto',
          minWidth: '120px',
          padding: '16px 0',
          fontFamily: 'var(--font-poppins)'
        }}
      >
        {floors.map((floor) => {
          const floorData = departamentosData[floor.key]
          const isExpanded = expandedFloor === floor.key

          return (
            <div key={floor.key}>
              {/* Header del piso */}
              <button
                onClick={() => toggleFloor(floor.key)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: isExpanded ? 'rgba(74, 158, 255, 0.1)' : 'transparent',
                  border: 'none',
                  borderRight: isExpanded ? '3px solid var(--color-one)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: isExpanded ? 'var(--color-one)' : 'var(--color-three)',
                  textAlign: 'left',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  opacity: isExpanded ? 1 : 0.6,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {floor.label}
                <span
                  style={{
                    fontSize: '10px',
                    transition: 'transform 0.2s ease',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                >
                  ▼
                </span>
              </button>

              {/* Unidades del piso - Accordion */}
              {isExpanded && floorData && floorData.unidades && (
                <div
                  style={{
                    background: 'rgba(74, 158, 255, 0.05)',
                    borderLeft: '2px solid rgba(74, 158, 255, 0.2)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}
                >
                  {floorData.unidades.map((unit, index) => (
                    <button
                      key={index}
                      onClick={() => handleUnitClick(floor.key, unit)}
                      style={{
                        width: '100%',
                        padding: '8px 16px 8px 28px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '11px',
                        fontWeight: '400',
                        color: 'var(--color-darck)',
                        textAlign: 'left',
                        opacity: 0.6,
                        borderLeft: '2px solid transparent',
                        display: 'block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = '1'
                        e.target.style.borderLeftColor = 'var(--color-one)'
                        e.target.style.background = 'rgba(74, 158, 255, 0.08)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = '0.6'
                        e.target.style.borderLeftColor = 'transparent'
                        e.target.style.background = 'transparent'
                      }}
                    >
                      {unit.meshNamePattern || `${floor.label}`}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Amenities */}
        <div
          style={{
            borderTop: '1px solid rgba(226, 216, 206, 0.2)',
            marginTop: '8px',
            paddingTop: '8px'
          }}
        >
          <button
            onClick={() =>
              onFloorSelect({
                nombre: 'Terraza y Amenities',
                tipologia: 'Amenities',
                ambientes: 'Área común',
                descripcion: 'Disfruta de nuestras amenities: piscina, solárium y quinchos'
              })
            }
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--color-three)',
              textAlign: 'left',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              opacity: 0.6
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '1'
              e.target.style.color = 'var(--color-one)'
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '0.6'
              e.target.style.color = 'var(--color-three)'
            }}
          >
            AMENITIES
          </button>
        </div>
      </div>
    </div>
  )
}
