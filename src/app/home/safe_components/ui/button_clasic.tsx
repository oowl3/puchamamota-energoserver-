import React, { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
}

function Button_clasic({ children }: ButtonProps) {
  return (
    <div className='relative w-11 h-11'>
      <div className="absolute w-8.25 h-8.25 rounded-full bg-[var(--color-v-2_1)] right-[-.3rem] top-3/8 -translate-y-1/2 -z-10"></div>
      <div className="absolute w-5.5 h-5.5 rounded-full bg-[var(--color-v-3_1)] left-[-.1rem] top-[2rem] -translate-y-1/2 -z-10"></div>
        
      <div className='relative w-full h-full rounded-full bg-[var(--color-v-4_1)] cursor-pointer flex items-center justify-center overflow-hidden'>
        <div className="relative z-10 flex items-center justify-center w-full h-full text-xs text-center whitespace-nowrap overflow-hidden px-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Button_clasic;