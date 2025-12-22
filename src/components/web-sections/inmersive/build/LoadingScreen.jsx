export function LoadingScreen({ loadingProgress, isLoading }) {
  if (!isLoading) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        style={{
          fontSize: '24px',
          fontWeight: '300',
          color: '#fff',
          letterSpacing: '2px',
          marginBottom: '20px'
        }}
      >
        EDIFICIO GÜEMES
      </div>

      <div
        style={{
          width: '80%',
          maxWidth: '300px',
          textAlign: 'center',
          padding: '0 20px'
        }}
      >
        <div
          style={{
            fontSize: '48px',
            fontWeight: '200',
            color: '#4a9eff',
            marginBottom: '16px'
          }}
        >
          {Math.floor(loadingProgress)}%
        </div>

        <div
          style={{
            width: '100%',
            height: '2px',
            backgroundColor: 'rgba(74, 158, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${loadingProgress}%`,
              backgroundColor: '#4a9eff',
              transition: 'width 0.3s ease',
              boxShadow: '0 0 10px rgba(74, 158, 255, 0.5)'
            }}
          />
        </div>

        <div
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: '24px',
            letterSpacing: '1px'
          }}
        >
          Cargando modelo 3D...
        </div>
      </div>
    </div>
  )
}
