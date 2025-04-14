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


//<Button_clasic>
//<div className="flex flex-col items-center justify-center gap-[2px] w-full  text-white">
//  <span className="material-symbols-outlined text-[1.3rem] leading-none">person_apron</span>
//  <span className="text-[0.5rem] font-medium">Perfil</span>
//</div>
//</Button_clasic>