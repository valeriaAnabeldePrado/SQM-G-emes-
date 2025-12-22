export const Card = ({
  children,
  className = '',
  hasGradient = false,
  opacity = '100%',
  cardGradient = 'var(--gradient-card)',
  borderStyleCustom = '2px solid var(--color-border)'
}) => {
  const baseClasses = `
  rounded-[var(--border-radius-phone)] 
  min-d:rounded-[var(--border-radius-tablet)]
 min-extra:rounded-[var(--border-radius-note)]
 min-note:rounded-[var(--border-radius-desktop)]
flex items-start justify-center p-[var(--padding-cards-small)] min-extra:p-[var(--padding-cards)] 
`

  const style = hasGradient
    ? {
        background: cardGradient,
        border: borderStyleCustom,
        opacity: opacity
      }
    : { opacity: opacity }

  return (
    <div className={`${baseClasses} ${className} `} style={style}>
      {children}
    </div>
  )
}
