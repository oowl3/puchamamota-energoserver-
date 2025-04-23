import React from 'react'
import { getUserSession } from '@/lib/session'

const Profile = async () => {
  const userSession = await getUserSession()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/usuario/${userSession.id}`, { cache: 'no-store'})
  const userData = await res.json()
  return (
    <div className='bg-[var(--color-v-1)] pl-2 pr-2'>
      <div className="pt-18 pl-2 pr-2 bg-[var(--color-bg)]">
        <h5>Configuracion del perfil</h5>
        <h6> hola {userData.nombre || userSession.name}</h6>
      </div>
    </div>
  )
}
 
export default  Profile