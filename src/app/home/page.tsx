import { getUserSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const userSession = await getUserSession()

  if (!userSession) {
    redirect('/start')
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/usuario/${userSession.id}`, { cache: 'no-store'})
  const userData = await res.json()
  return (
    <div className="pt-18">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Bienvenido, {userData.nombre || userSession.name}</h1>
        </div>
      </div>
        
    </div>
  )
}