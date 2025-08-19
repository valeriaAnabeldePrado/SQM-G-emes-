import React from 'react'

export default function Button({ children, icon, className, onClick, ...props }) {
  return (
    <button
      className={` px-8 py-4 rounded-full min-2xl:text-lg min-xl:text-md  cursor-pointer font-medium bg-[var(--color-one)] text-white hover:brightness-90 transition-all duration-300 ease-in-out flex min-2xl:gap-8  gap-2 items-center ${className} `}
      onClick={onClick || (() => console.log('click'))}
      {...props}
    >
      {children}
      {icon}
    </button>
  )
}
