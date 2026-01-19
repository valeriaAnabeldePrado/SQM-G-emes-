import { useState, useMemo } from 'react'
import { edificioVivra } from './constant'

export function FloorsPanel({ onFloorSelect }) {
  const [expandedFloor, setExpandedFloor] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const floors = [
    { key: 'P00', label: 'PB' },
    { key: 'P01', label: '01' },
    { key: 'P02', label: '02' },
    { key: 'P03', label: '03' },
    { key: 'P04', label: '04' },
    { key: 'P05', label: '05' },
    { key: 'P06', label: '06' },
    { key: 'P07', label: '07' },
    { key: 'P08', label: '08' },
    { key: 'P09', label: '09' },
    { key: 'P10', label: '10' },
    { key: 'P11', label: '11' },
    { key: 'P12', label: '12' },
    { key: 'P13', label: '13' },
    { key: 'P14', label: '14' },
    { key: 'P15', label: '15' }
  ]

  // Filtrar unidades según el filtro seleccionado
  const getFilteredUnits = (units) => {
    if (selectedFilter === 'all') return units
    if (selectedFilter === 'oficina') {
      return units.filter((u) => u.tipologia?.toLowerCase().includes('oficina'))
    }
    const bedrooms = parseInt(selectedFilter)
    return units.filter((u) => {
      const ambientes = parseInt(u.ambientes)
      return ambientes === bedrooms
    })
  }

  // Contar unidades por filtro
  const filterCounts = useMemo(() => {
    const counts = { all: 0, oficina: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
    Object.values(edificioVivra).forEach((floor) => {
      floor.unidades?.forEach((unit) => {
        counts.all++
        if (unit.tipologia?.toLowerCase().includes('oficina')) {
          counts.oficina++
        }
        const amb = parseInt(unit.ambientes)
        if (amb >= 1 && amb <= 4) counts[amb]++
      })
    })
    return counts
  }, [])

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

  const FilterButton = ({ value, label, count }) => {
    const isActive = selectedFilter === value
    return (
      <button
        onClick={() => setSelectedFilter(value)}
        style={{
          padding: '6px 12px',
          background: isActive ? 'rgba(255, 196, 106, 0.2)' : 'rgba(255, 255, 255, 0.08)',
          border: `1px solid ${isActive ? 'rgba(255, 196, 106, 0.4)' : 'rgba(255, 255, 255, 0.15)'}`,
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '600',
          color: isActive ? 'var(--color-two)' : 'rgba(255, 255, 255, 0.7)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
          }
        }}
      >
        {label} {count > 0 && `(${count})`}
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: window.innerWidth < 1024 ? 'none' : 'block'
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderLeft: 'none',
          borderRadius: '0 16px 16px 0',
          maxHeight: '86vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '240px',
          padding: '20px 0',
          fontFamily: "'Poppins', sans-serif",
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header compacto */}
        <div
          style={{ padding: '0 16px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '15px',
              fontWeight: '600',
              color: '#fff',
              letterSpacing: '-0.2px'
            }}
          >
            Unidades
          </h3>

          {/* Filtros */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <FilterButton value="all" label="Todas" count={filterCounts.all} />
            <FilterButton value="1" label="1 Dorm" count={filterCounts[1]} />
            <FilterButton value="2" label="2 Dorm" count={filterCounts[2]} />
            <FilterButton value="3" label="3 Dorm" count={filterCounts[3]} />
            {filterCounts[4] > 0 && (
              <FilterButton value="4" label="4 Dorm" count={filterCounts[4]} />
            )}
            {filterCounts.oficina > 0 && (
              <FilterButton value="oficina" label="Oficinas" count={filterCounts.oficina} />
            )}
          </div>
        </div>

        {/* Lista de pisos compacta */}
        <div style={{ padding: '8px 0' }}>
          {floors.map((floor) => {
            const floorData = edificioVivra[floor.key]
            const allUnits = floorData?.unidades || []
            const filteredUnits = getFilteredUnits(allUnits)
            const isExpanded = expandedFloor === floor.key

            if (filteredUnits.length === 0) return null

            return (
              <div key={floor.key}>
                {/* Header del piso - compacto */}
                <button
                  onClick={() => toggleFloor(floor.key)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    background: isExpanded ? 'rgba(255, 196, 106, 0.12)' : 'transparent',
                    border: 'none',
                    borderLeft: isExpanded ? '2px solid var(--color-two)' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#fff',
                        letterSpacing: '-0.2px'
                      }}
                    >
                      Nivel {floor.label}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.5)',
                        marginTop: '2px'
                      }}
                    >
                      {filteredUnits.length} unidad{filteredUnits.length !== 1 ? 'es' : ''}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: isExpanded ? 'var(--color-two)' : 'rgba(255, 255, 255, 0.4)',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ▼
                  </div>
                </button>

                {/* Unidades - lista compacta */}
                {isExpanded && (
                  <div
                    style={{
                      background: 'rgba(255, 196, 106, 0.04)',
                      borderLeft: '2px solid rgba(255, 196, 106, 0.15)',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}
                  >
                    {filteredUnits.map((unit, index) => (
                      <button
                        key={index}
                        onClick={() => handleUnitClick(floor.key, unit)}
                        style={{
                          width: '100%',
                          padding: '8px 16px 8px 24px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'left',
                          display: 'block'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 196, 106, 0.1)'
                          e.currentTarget.style.paddingLeft = '28px'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.paddingLeft = '24px'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#fff',
                            marginBottom: '2px'
                          }}
                        >
                          {unit.tipologia || 'Unidad'}
                        </div>
                        <div
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}
                        >
                          {unit.ambientes && `${unit.ambientes} amb`}
                          {unit.superficiePropia && ` • ${unit.superficiePropia}m²`}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Amenities compacto */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            margin: '8px 16px 0',
            paddingTop: '12px'
          }}
        >
          <button
            onClick={() =>
              onFloorSelect({
                nombre: 'Amenities',
                tipologia: 'Amenities',
                ambientes: 'Área común',
                descripcion: 'Piscina, solárium y quinchos con vistas panorámicas.'
              })
            }
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'rgba(202, 73, 62, 0.1)',
              border: '1px solid rgba(202, 73, 62, 0.25)',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(202, 73, 62, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(202, 73, 62, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(202, 73, 62, 0.1)'
              e.currentTarget.style.borderColor = 'rgba(202, 73, 62, 0.25)'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#fff',
                marginBottom: '2px'
              }}
            >
              Amenities
            </div>
            <div
              style={{
                fontSize: '9px',
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              Espacios comunes
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
