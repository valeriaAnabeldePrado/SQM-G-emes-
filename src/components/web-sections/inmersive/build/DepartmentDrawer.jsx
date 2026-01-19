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
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          boxShadow: isDrawerOpen
            ? '0 24px 48px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.08)'
            : 'none',
          zIndex: 1000,
          opacity: isDrawerOpen ? 1 : 0,
          transform: isDrawerOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          fontFamily: "'Poppins', sans-serif",
          color: 'var(--color-darck)',
          pointerEvents: isDrawerOpen ? 'auto' : 'none'
        }}
      >
        {/* Close button */}
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
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
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
            e.target.style.background = 'rgba(255, 196, 106, 0.3)'
            e.target.style.transform = 'scale(1.05) rotate(90deg)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)'
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
                color: '#fff',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: '600',
                opacity: 0.9,
                padding: '4px 10px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
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
                color: '#fff',
                letterSpacing: '-0.5px',
                lineHeight: '1.2',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              {selectedDepartment.nombre || selectedDepartment.tipologia}
            </h2>
            {selectedDepartment.orientacion && (
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '400'
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
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
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
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '500',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
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
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0 0 16px 0'
              }}
            >
              {selectedDepartment.descripcion}
            </p>
          )}

          {/* CTA Button */}
          <button
            onClick={() => {
              const departmentName = selectedDepartment.nombre || selectedDepartment.tipologia
              const message = `Hola! Quiero información del edificio Vivra Guemes y quería información del ${departmentName}`
              const whatsappURL = `https://wa.me/5493513470043?text=${encodeURIComponent(message)}`
              window.open(whatsappURL, '_blank')
            }}
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
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div
        style={{
          fontSize: '8px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: '600'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: '#fff',
          letterSpacing: '-0.2px'
        }}
      >
        {value}
      </div>
    </div>
  )
}
