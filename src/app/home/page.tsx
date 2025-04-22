import { getUserSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { isUserDataIncomplete } from '@/lib/validateUserData'
import Button_signout from './safe_components/ui/Button_signout'
import Header_home from './safe_components/header/Header_home'
export default async function HomePage() {
  const userSession = await getUserSession()

  if (!userSession) {
    redirect('/start')
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/usuario/${userSession.id}`, {
    cache: 'no-store',
  })
  const userData = await res.json()
  const datosIncompletos = isUserDataIncomplete(userData)

  return (
    <div>
      <Header_home />
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bienvenido, {userData.nombre || userSession.name}</h1>
        </div>
      </div>

      {datosIncompletos && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
          <p>🔔 Por favor, completa tu información personal para disfrutar de todas las funcionalidades.</p>
        </div>
      )}

      <pre className="bg-gray-100 p-4 rounded-lg">
        {JSON.stringify(userData, null, 2)}
      </pre>
      <Button_signout />
    </div>
  )
}