'use client';

import { signIn } from 'next-auth/react';

export default function Button_goole() {
  const handleLogin = () => {
    signIn('google', {
      callbackUrl: '/home',
      redirect: true 
    });
  };

  return (
<button 
  className="
    w-full max-w-xs
    bg-white hover:bg-[var(--color-v-6_1)]
    border border-gray-300
    rounded-[3px]
    shadow-sm
    px-4 py-2
    m-1
    transition-colors
    cursor-pointer
  " 
  onClick={handleLogin}
>
  <div className="flex items-center justify-center space-x-3">
    <div className="shrink-0">
      <svg 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 48 48" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        className="w-6 h-6"
      >
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      </svg>
    </div>
    <span className="font-normal text-black">Continuar con Google</span>
  </div>
</button>
  );
}

