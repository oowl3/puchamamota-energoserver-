import { getUserSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import Button_signout from '../components/elements/button/Button_signout'

export default async function Home() {
  const user = await getUserSession()
  
  if (!user) {
    redirect('/start')
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bienvenido, {user.name}</h1>
          <p className="text-gray-600">ID de usuario: {user.id}</p>
        </div>
        <Button_signout />
      </div>

      <pre className="bg-gray-100 p-4 rounded-lg">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  )
}