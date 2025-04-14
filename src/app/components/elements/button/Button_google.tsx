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
      onClick={handleLogin}
      className="px-6 py-3 bg-white text-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-3 border border-gray-300"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
      </svg>
      <span>Continuar con Google</span>
    </button>
  );
}