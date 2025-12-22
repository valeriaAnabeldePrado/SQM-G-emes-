export function DepartmentDrawer({ selectedDepartment, isDrawerOpen, onClose }) {
  if (!selectedDepartment) return null

  return (
    <>
      {/* Overlay/backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(19, 31, 40, 0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          opacity: isDrawerOpen ? 1 : 0,
          transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: isDrawerOpen ? 'auto' : 'none'
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: window.innerWidth < 768 ? '100%' : window.innerWidth < 1024 ? '480px' : '580px',
          height: '100%',
          background: 'rgba(255, 252, 249, 0.95)',
          borderLeft: '1px solid rgba(226, 216, 206, 0.4)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          zIndex: 1000,
          transform: isDrawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          boxShadow: isDrawerOpen ? '-2px 0 20px rgba(0, 0, 0, 0.08)' : 'none',
          overflowY: 'auto',
          overflowX: 'hidden',
          fontFamily: 'var(--font-poppins)',
          color: 'var(--color-darck)',
          willChange: 'transform'
        }}
      >
        {/* Header del drawer */}
        <div
          style={{
            padding: window.innerWidth < 768 ? '20px' : '28px 32px 20px',
            borderBottom: '1px solid rgba(226, 216, 206, 0.3)',
            position: 'sticky',
            top: 0,
            background: 'rgba(255, 252, 249, 0.98)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 1
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'var(--color-three)',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1,
              opacity: 0.5,
              transition: 'opacity 0.2s',
              fontWeight: '300'
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '1')}
            onMouseLeave={(e) => (e.target.style.opacity = '0.5')}
          >
            ×
          </button>

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
            {selectedDepartment.tipologia}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
              fontWeight: '400',
              fontFamily: "'Poppins', sans-serif",
              color: 'var(--color-darck)',
              letterSpacing: '0.3px'
            }}
          >
            {selectedDepartment.nombre || selectedDepartment.tipologia}
          </h2>
        </div>

        {/* Contenido del drawer */}
        <div style={{ padding: window.innerWidth < 768 ? '20px' : '28px 32px 32px' }}>
          {/* Imagen del plano - PRIMERO Y MÁS GRANDE */}
          {selectedDepartment.floorPlanImage && (
            <div style={{ marginBottom: '28px' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-three)',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  fontWeight: '500',
                  opacity: 0.7
                }}
              >
                Plano del departamento
              </div>
              <img
                src={selectedDepartment.floorPlanImage}
                alt={`Plano ${selectedDepartment.tipologia}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  border: '1px solid rgba(226, 216, 206, 0.4)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer'
                }}
                onClick={() => window.open(selectedDepartment.floorPlanImage, '_blank')}
              />
            </div>
          )}

          {/* Información básica - EN GRID COMPACTO */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px 20px',
              marginBottom: '28px',
              padding: '20px',
              background: 'rgba(226, 216, 206, 0.15)',
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
            {selectedDepartment.balcones && (
              <InfoFieldCompact label="Balcones" value={`${selectedDepartment.balcones} m²`} />
            )}
            {selectedDepartment.descubierta && (
              <InfoFieldCompact
                label="Descubierta"
                value={`${selectedDepartment.descubierta} m²`}
              />
            )}
          </div>

          {/* Descripción */}
          {selectedDepartment.descripcion && (
            <div style={{ marginBottom: '28px' }}>
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: 'var(--color-darck)',
                  margin: 0,
                  opacity: 0.85
                }}
              >
                {selectedDepartment.descripcion}
              </p>
            </div>
          )}

          {/* Botón de acción */}
          <button
            style={{
              width: '100%',
              padding: '16px 32px',
              backgroundColor: 'var(--color-one)',
              color: 'white',
              border: 'none',
              borderRadius: '9999px',
              fontSize: 'clamp(1rem, 2vw, 1.1rem)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              letterSpacing: '0.3px',
              fontFamily: 'var(--font-poppins)'
            }}
            onMouseEnter={(e) => (e.target.style.filter = 'brightness(0.9)')}
            onMouseLeave={(e) => (e.target.style.filter = 'brightness(1)')}
          >
            Solicitar información
          </button>

          {/* Debug info */}
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
    <div>
      <div
        style={{
          fontSize: '10px',
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
          color: 'var(--color-darck)'
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
