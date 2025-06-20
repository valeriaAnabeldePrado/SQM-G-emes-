import { CardArrow } from './card-arrow'

export function CardListItem({ children, className = '', ...props }) {
  return (
    <CardArrow
      className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 min-d:hover:flex-[2] flex flex-col ${className}`}
      {...props}
    >
      {children}
    </CardArrow>
  )
}
