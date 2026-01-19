export function DepartmentDrawer({ selectedDepartment, isDrawerOpen, onClose }) {
  if (!selectedDepartment) return null

  return (
    <>
      {/* Overlay sutil */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(19, 31, 40, 0.3)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 999,
          opacity: isDrawerOpen ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: isDrawerOpen ? 'auto' : 'none'
        }}
      />

      {/* Peek Card - Bottom Right */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: window.innerWidth < 768 ? '20px' : '40px',
          right: window.innerWidth < 768 ? '20px' : '40px',
          width: window.innerWidth < 768 ? 'calc(100vw - 40px)' : 'min(420px, calc(100vw - 80px))',
          maxHeight: '75vh',
          background: 'linear-gradient(135deg, rgba(255, 252, 249, 0.95) 0%, rgba(249, 240, 226, 0.95) 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(226, 216, 206, 0.5)',
          borderRadius: '20px',
          boxShadow: isDrawerOpen
            ? '0 24px 48px rgba(72, 59, 43, 0.2), 0 12px 24px rgba(72, 59, 43, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)'
            : 'none',
          zIndex: 1000,
          opacity: isDrawerOpen ? 1 : 0,
          transform: isDrawerOpen 
            ? 'translateY(0) scale(1)' 
            : 'translateY(20px) scale(0.98)',
          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          fontFamily: "'Poppins', sans-serif",
          color: 'var(--color-darck)',
          pointerEvents: isDrawerOpen ? 'auto' : 'none'
        }}
      >
        {/* Close button - esquina superior derecha */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(226, 216, 206, 0.5)',
            borderRadius: '50%',
            color: 'var(--color-three)',
            fontSize: '16px',
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'all 0.2s ease',
            fontWeight: '300',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 196, 106, 0.4)'
            e.target.style.transform = 'scale(1.05) rotate(90deg)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.5)'
            e.target.style.transform = 'scale(1) rotate(0deg)'
          }}
        >
          ×
        </button>

        {/* Content wrapper */}
        <div style={{ padding: '24px' }}>
          {/* Header compacto */}
          <div style={{ marginBottom: '20px', paddingRight: '20px' }}>
            <div
              style={{
                display: 'inline-block',
                fontSize: '8px',
                color: 'var(--color-three)',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: '600',
                opacity: 0.7,
                padding: '4px 10px',
                background: 'rgba(226, 216, 206, 0.3)',
                borderRadius: '12px'
              }}
            >
              {selectedDepartment.tipologia}
            </div>
            <h2
              style={{
                margin: '8px 0 0 0',
                fontSize: 'clamp(1.4rem, 2.5vw, 1.7rem)',
                fontWeight: '600',
                fontFamily: "'Poppins', sans-serif",
                color: 'var(--color-darck)',
                letterSpacing: '-0.5px',
                lineHeight: '1.2'
              }}
            >
              {selectedDepartment.nombre || selectedDepartment.tipologia}
            </h2>
            {selectedDepartment.orientacion && (
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: 'var(--color-three)',
                  fontWeight: '400',
                  opacity: 0.8
                }}
              >
                {selectedDepartment.orientacion}
              </div>
            )}
          </div>

          {/* Quick info - 2 columnas compactas */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              marginBottom: '16px'
            }}
          >
            <QuickInfo label="Ambientes" value={selectedDepartment.ambientes} />
            <QuickInfo label="Piso" value={selectedDepartment.piso} />
            <QuickInfo
              label="Sup. Propia"
              value={
                selectedDepartment.superficiePropia
                  ? `${selectedDepartment.superficiePropia} m²`
                  : 'Consultar'
              }
            />
            <QuickInfo
              label="Sup. Total"
              value={
                selectedDepartment.superficieTotal
                  ? `${selectedDepartment.superficieTotal} m²`
                  : 'Consultar'
              }
            />
          </div>

          {/* Floor plan preview compacto */}
          {selectedDepartment.floorPlanImage && (
            <div
              style={{
                marginBottom: '16px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(226, 216, 206, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(72, 59, 43, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              onClick={() => window.open(selectedDepartment.floorPlanImage, '_blank')}
            >
              <img
                src={selectedDepartment.floorPlanImage}
                alt={`Plano ${selectedDepartment.tipologia}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  backgroundColor: '#fafafa'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '500',
                  color: 'var(--color-three)',
                  border: '1px solid rgba(226, 216, 206, 0.4)'
                }}
              >
                Ver plano completo
              </div>
            </div>
          )}

          {/* Description */}
          {selectedDepartment.descripcion && (
            <p
              style={{
                fontSize: '12px',
                lineHeight: '1.6',
                color: 'var(--color-three)',
                margin: '0 0 16px 0',
                opacity: 0.9
              }}
            >
              {selectedDepartment.descripcion}
            </p>
          )}

          {/* CTA Button */}
          <button
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'var(--color-one)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.3px',
              fontFamily: "'Poppins', sans-serif",
              boxShadow: '0 4px 12px rgba(202, 73, 62, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)'
              e.target.style.boxShadow = '0 6px 16px rgba(202, 73, 62, 0.35)'
              e.target.style.filter = 'brightness(1.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 12px rgba(202, 73, 62, 0.25)'
              e.target.style.filter = 'brightness(1)'
            }}
          >
            Solicitar Información
          </button>
        </div>
      </div>
    </>
  )
}

// Componente compacto para info rápida
function QuickInfo({ label, value }) {
  return (
    <div
      style={{
        padding: '10px 12px',
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(226, 216, 206, 0.3)'
      }}
    >
      <div
        style={{
          fontSize: '8px',
          color: 'var(--color-three)',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: '600',
          opacity: 0.6
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--color-darck)',
          letterSpacing: '-0.2px'
        }}
      >
        {value}
      </div>
    </div>
  )
}

// Componente auxiliar para campos de información (conservado para compatibilidad)
function InfoField({ label, value }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--color-three)',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontWeight: '500',
          opacity: 0.7
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '15px',
          fontWeight: '400',
          color: 'var(--color-darck)'
        }}
      >
        {value}
      </div>
    </div>
  )
}
          </h2>
          {selectedDepartment.orientacion && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '13px',
                color: 'var(--color-three)',
                fontWeight: '400'
              }}
            >
              {selectedDepartment.orientacion}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: window.innerWidth < 768 ? '20px 18px' : '24px 28px 28px' }}>
          {/* Floor plan */}
          {selectedDepartment.floorPlanImage && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '9px',
                  color: 'var(--color-three)',
                  marginBottom: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.3px',
                  fontWeight: '500',
                  opacity: 0.7
                }}
              >
                Plano del departamento
              </div>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(72, 59, 43, 0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(226, 216, 206, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(72, 59, 43, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(72, 59, 43, 0.08)'
                }}
                onClick={() => window.open(selectedDepartment.floorPlanImage, '_blank')}
              >
                <img
                  src={selectedDepartment.floorPlanImage}
                  alt={`Plano ${selectedDepartment.tipologia}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    backgroundColor: '#fafafa'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(226, 216, 206, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: 'var(--color-three)',
                    border: '1px solid rgba(226, 216, 206, 0.4)',
                    letterSpacing: '0.3px'
                  }}
                >
                  Ver ampliado
                </div>
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
              marginBottom: '20px',
              padding: '18px',
              background: 'rgba(249, 240, 226, 0.4)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(226, 216, 206, 0.3)'
            }}
          >
            <InfoFieldCompact label="Ambientes" value={selectedDepartment.ambientes} />
            <InfoFieldCompact label="Piso" value={selectedDepartment.piso} />
            <InfoFieldCompact
              label="Sup. Propia"
              value={
                selectedDepartment.superficiePropia
                  ? `${selectedDepartment.superficiePropia} m²`
                  : 'Consultar'
              }
            />
            <InfoFieldCompact
              label="Sup. Total"
              value={
                selectedDepartment.superficieTotal
                  ? `${selectedDepartment.superficieTotal} m²`
                  : 'Consultar'
              }
            />
            {selectedDepartment.balcones > 0 && (
              <InfoFieldCompact label="Balcones" value={`${selectedDepartment.balcones} m²`} />
            )}
            {selectedDepartment.descubierta && (
              <InfoFieldCompact
                label="Descubierta"
                value={`${selectedDepartment.descubierta} m²`}
              />
            )}
          </div>

          {/* Description */}
          {selectedDepartment.descripcion && (
            <div
              style={{
                marginBottom: '20px',
                padding: '16px 18px',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '10px',
                border: '1px solid rgba(226, 216, 206, 0.3)'
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  color: 'var(--color-three)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.3px',
                  fontWeight: '500',
                  opacity: 0.7
                }}
              >
                Descripción
              </div>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: 'var(--color-three)',
                  margin: 0,
                  fontWeight: '400'
                }}
              >
                {selectedDepartment.descripcion}
              </p>
            </div>
          )}

          {/* CTA Button */}
          <button
            style={{
              width: '100%',
              padding: '14px 28px',
              background: 'rgba(202, 73, 62, 0.9)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(202, 73, 62, 0.3)',
              borderRadius: '10px',
              fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              letterSpacing: '0.3px',
              fontFamily: "'Poppins', sans-serif",
              boxShadow: '0 4px 12px rgba(202, 73, 62, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.background = 'rgba(202, 73, 62, 1)'
              e.target.style.boxShadow = '0 6px 16px rgba(202, 73, 62, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.background = 'rgba(202, 73, 62, 0.9)'
              e.target.style.boxShadow = '0 4px 12px rgba(202, 73, 62, 0.2)'
            }}
          >
            Solicitar Información
          </button>

          {/* Debug info (opcional - remover en producción) */}
          <div
            style={{
              marginTop: '40px',
              padding: '16px',
              background: 'rgba(226, 216, 206, 0.3)',
              borderRadius: '15px',
              fontSize: '12px',
              color: 'var(--color-three)',
              border: '1px solid rgba(179, 175, 171, 0.2)'
            }}
          >
            <div>Mesh: {selectedDepartment.meshName}</div>
            <div>Piso Key: {selectedDepartment.piso}</div>
          </div>
        </div>
      </div>
    </>
  )
}

// Componente auxiliar para campos de información compactos en grid
function InfoFieldCompact({ label, value }) {
  return (
    <div
      style={{
        padding: '2px 0'
      }}
    >
      <div
        style={{
          fontSize: '9px',
          color: 'var(--color-three)',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          fontWeight: '500',
          opacity: 0.7
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: '500',
          color: 'var(--color-darck)',
          letterSpacing: '-0.1px'
        }}
      >
        {value}
      </div>
    </div>
  )
}

// Componente auxiliar para campos de información (conservado para compatibilidad)
function InfoField({ label, value }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--color-three)',
          marginBottom: '6px',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontWeight: '500',
          opacity: 0.7
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '15px',
          fontWeight: '400',
          color: 'var(--color-darck)'
        }}
      >
        {value}
      </div>
    </div>
  )
}
