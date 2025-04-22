'use client'

import { signOut } from 'next-auth/react'

export default function Button_signout() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/start' })}>
      <p>Cerrar sesión</p>
    </button>
  )
}


