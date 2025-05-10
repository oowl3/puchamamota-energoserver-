import { getUserSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { isUserDataIncomplete } from '@/lib/validateUserData'

export default async function HomePage() {
  const userSession = await getUserSession()

  if (!userSession) {
    redirect('/start')
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/usuario/${userSession.id}`, { cache: 'no-store'})
  const userData = await res.json()
  const datosIncompletos = isUserDataIncomplete(userData)

  return (
    <div className="pt-18">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Bienvenido, {userData.nombre || userSession.name}</h1>
        </div>
      </div>

      {datosIncompletos && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
          <p>🔔 Por favor, completa tu información personal para disfrutar de todas las funcionalidades.</p>
          <h2>Completa tu registro, llenando el siguiente formulario</h2>
        </div>
      )}
    </div>
  )
}