import { useState, useMemo } from 'react'
import { edificioVivra } from './constant'

export function FloorsPanel({ onHighlightUnits }) {
  const [selectedFilter, setSelectedFilter] = useState(null)

  // Contar unidades por tipo
  const unitCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, loft: 0, duplex: 0, oficina: 0 }
    Object.values(edificioVivra).forEach((floor) => {
      floor.unidades?.forEach((unit) => {
        const type = unit.tipologia?.toLowerCase() || ''

        if (type.includes('oficina')) {
          counts.oficina++
        }

        // Count independently as a unit can be multiple things
        if (unit.loft) counts.loft++
        // Para duplex, solo contar el piso bajo (no contar pisos altos para evitar duplicados)
        if (unit.duplex && !unit.isDuplexUpper) counts.duplex++

        if (unit.rooms === 1) counts[1]++
        if (unit.rooms === 2) counts[2]++
      })
    })
    return counts
  }, [])

  // Obtener unidades filtradas para resaltar
  const getUnitsToHighlight = (filterType) => {
    const units = []
    Object.entries(edificioVivra).forEach(([floorKey, floorData]) => {
      floorData.unidades?.forEach((unit) => {
        const type = unit.tipologia?.toLowerCase() || ''
        let match = false

        if (filterType === 'oficina') {
          if (type.includes('oficina')) match = true
        } else if (filterType === 'loft') {
          if (unit.loft) match = true
        } else if (filterType === 'duplex') {
          if (unit.duplex) match = true
        } else {
          // It's a number (rooms)
          if (unit.rooms === parseInt(filterType)) match = true
        }

        if (match) {
          units.push({ floorKey, unit })
        }
      })
    })
    if (filterType === 'duplex') {
      console.log(
        '🎯 Duplex units to highlight:',
        units.map((u) => ({
          floor: u.floorKey,
          mesh: u.unit.meshNamePattern,
          nombre: u.unit.nombre
        }))
      )
    }
    return units
  }

  const handleFilterClick = (filterType) => {
    if (selectedFilter === filterType) {
      // Deseleccionar
      setSelectedFilter(null)
      onHighlightUnits([])
    } else {
      // Seleccionar y resaltar
      setSelectedFilter(filterType)
      const unitsToHighlight = getUnitsToHighlight(filterType)
      onHighlightUnits(unitsToHighlight)
    }
  }

  const filters = [
    { type: '1', label: '1 Dormitorio', icon: '🛏️', count: unitCounts[1] },
    { type: '2', label: '2 Dormitorios', icon: '🛏️', count: unitCounts[2] },
    ...(unitCounts.loft > 0
      ? [{ type: 'loft', label: 'Loft / Estudio', icon: '🎨', count: unitCounts.loft }]
      : []),
    ...(unitCounts.duplex > 0
      ? [{ type: 'duplex', label: 'Duplex', icon: '🏠', count: unitCounts.duplex }]
      : []),
    ...(unitCounts.oficina > 0
      ? [{ type: 'oficina', label: 'Oficinas', icon: '💼', count: unitCounts.oficina }]
      : [])
  ]

  return (
    <div
      style={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: window.innerWidth < 1024 ? 'none' : 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px 14px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: "'Poppins', sans-serif",
            marginBottom: '4px',
            letterSpacing: '0.3px'
          }}
        >
          Filtrar por tipo
        </div>
        <div
          style={{
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: '400'
          }}
        >
          Click para resaltar
        </div>
      </div>

      {/* Filtros */}
      {filters.map((filter) => {
        const isActive = selectedFilter === filter.type
        return (
          <button
            key={filter.type}
            onClick={() => handleFilterClick(filter.type)}
            style={{
              background: isActive
                ? 'linear-gradient(135deg, rgba(255, 196, 106, 0.25) 0%, rgba(255, 196, 106, 0.15) 100%)'
                : 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${isActive ? 'rgba(255, 196, 106, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
              borderRadius: '12px',
              padding: '12px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: '200px',
              boxShadow: isActive
                ? '0 4px 20px rgba(255, 196, 106, 0.25)'
                : '0 2px 12px rgba(0, 0, 0, 0.15)'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.transform = 'translateX(0)'
              }
            }}
          >
            <div
              style={{
                fontSize: '18px',
                lineHeight: 1
              }}
            >
              {filter.icon}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                  fontFamily: "'Poppins', sans-serif",
                  marginBottom: '2px',
                  letterSpacing: '-0.1px'
                }}
              >
                {filter.label}
              </div>
              <div
                style={{
                  fontSize: '9px',
                  color: isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '500'
                }}
              >
                {filter.count} {filter.count === 1 ? 'unidad' : 'unidades'}
              </div>
            </div>
            {isActive && (
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--color-two)',
                  boxShadow: '0 0 8px rgba(255, 196, 106, 0.6)'
                }}
              />
            )}
          </button>
        )
      })}

      {/* Botón limpiar */}
      {selectedFilter && (
        <button
          onClick={() => {
            setSelectedFilter(null)
            onHighlightUnits([])
          }}
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '8px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '10px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.7)',
            fontFamily: "'Poppins', sans-serif",
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)'
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
          }}
        >
          ✕ Limpiar filtro
        </button>
      )}
    </div>
  )
}
