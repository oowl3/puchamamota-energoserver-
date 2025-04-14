
import { getUserSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getUserSession() // Obtiene la sesión del servidor
  
  if (!user) {
    redirect('/start') // Redirige si no está autenticado (aunque el middleware ya lo maneja)
  }

  return (
    <div className="p-4">
      <h1>Bienvenido, {user.name}</h1>
      <p>Tu ID de usuario es: {user.id}</p>
      
      {/* Datos del usuario desde el servidor */}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}