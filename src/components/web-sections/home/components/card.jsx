export const Card = ({ children, className = '', hasGradient = false }) => {
  const baseClasses = `
  rounded-[var(--border-radius-tablet)] 
  min-d:rounded-[var(--border-radius-desktop)] 
  flex items-center justify-center p-[var(--padding-cards)] 
`
  console.log(className)

  const style = hasGradient ? { background: 'var(--gradient-card)' } : {}

  return (
    <div className={`${baseClasses} ${className} `} style={style}>
      {children}
    </div>
  )
}
