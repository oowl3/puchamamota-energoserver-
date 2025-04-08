import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

function Button_clasic({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="relative w-11 h-11 p-0 border-none bg-transparent outline-none focus:outline-none cursor-pointer"
    >
      <div className="absolute w-8.25 h-8.25 rounded-full bg-[var(--color-v-2_1)] right-[-.3rem] top-3/8 -translate-y-1/2 -z-10"></div>
      <div className="absolute w-5.5 h-5.5 rounded-full bg-[var(--color-v-3_1)] left-[-.1rem] top-[2rem] -translate-y-1/2 -z-10"></div>

      <div className="relative w-full h-full rounded-full bg-[var(--color-v-4_1)] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 flex flex-row items-center justify-center gap-1 w-full h-full">
          {children}
        </div>
      </div>
    </button>
  );
}

export default Button_clasic;