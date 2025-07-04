import React from 'react'

export default function Button({ children, icon, className }) {
  return (
    <button
      className={`px-10 py-4 rounded-full text-lg cursor-pointer font-medium bg-[var(--color-one)] text-white hover:brightness-90 transition-all duration-300 ease-in-out flex gap-8 items-center ${className} `}
      onClick={() => console.log('click')}
    >
      {children}
      {icon}
    </button>
  )
}
