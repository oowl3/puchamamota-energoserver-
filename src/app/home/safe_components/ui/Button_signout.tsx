'use client'

import { signOut } from 'next-auth/react'

export default function Button_signout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/start' })}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      Cerrar sesión
    </button>
  )
}


