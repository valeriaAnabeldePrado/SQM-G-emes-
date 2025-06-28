import { FaArrowDown } from 'react-icons/fa'

export const CardArrow = ({
  children,
  className = '',
  hasGradient = false,
  hideGradientOnHover = false,
  isRed = false
}) => {
  const baseClasses = `
   rounded-[var(--border-radius-phone)] 
   min-d:rounded-[var(--border-radius-tablet)]
   min-extra:rounded-[var(--border-radius-note)]
   min-note:rounded-[var(--border-radius-desktop)] 
   p-[var(--padding-cards)]
   transition-all duration-300 relative group
  `

  const gradientStyle = hasGradient
    ? {
        background: 'var(--gradient-card)',
        transition: 'background 0.3s ease',
        border: '2px solid var(--color-border)'
      }
    : {}

  const hoverClass = hideGradientOnHover ? 'hover:[background:var(--color-two)!important]' : ''

  return (
    <div className={`${baseClasses} ${className} ${hoverClass}`} style={gradientStyle}>
      <div className="hidden min-d:block min-d:absolute top-4 right-4 p-4 transition-transform duration-300 transform -rotate-45 group-hover:-rotate-135 z-10">
        <FaArrowDown size="2em" color={isRed ? 'var(--color-one)' : 'white'} />
      </div>
      {children}
    </div>
  )
}
