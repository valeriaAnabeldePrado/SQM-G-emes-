export const Card = ({ children, className = '', hasGradient = false }) => {
  const baseClasses = `
  rounded-[var(--border-radius-tablet)] 
  min-d:rounded-[var(--border-radius-desktop)] 
  flex items-start justify-center p-[var(--padding-cards)] 
`

  const style = hasGradient
    ? { background: 'var(--gradient-card)', border: '2px solid var(--color-border)' }
    : {}

  return (
    <div className={`${baseClasses} ${className} `} style={style}>
      {children}
    </div>
  )
}
