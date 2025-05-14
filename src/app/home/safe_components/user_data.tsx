// src/components/VerificaDatosUsuario.tsx
import { getUserSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { isUserDataIncomplete } from '@/lib/validateUserData'

// Interface para tipar la respuesta de la API
interface ApiResponse {
  id: string
  nombre: string
  apellido?: string | null
  edad?: bigint | number | null
  genero?: string | null
  telefono?: string | null
}

export default async function VerificaDatosUsuario() {
  const userSession = await getUserSession()

  if (!userSession) {
    redirect('/start')
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/usuario/${userSession.id}`, {
    cache: 'no-store',
  })
  
  if (!res.ok) {
    console.error('Error fetching user data:', await res.text())
    return null
  }

  const userData: ApiResponse = await res.json()
  
  // Verifica la estructura de los datos
  console.log('Datos del usuario:', userData)

  const datosIncompletos = isUserDataIncomplete(userData)

  if (!datosIncompletos) return null

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
      <p>🔔 Por favor, completa tu información personal para disfrutar de todas las funcionalidades.</p>
      <h2>Completa tu registro, llenando el siguiente formulario</h2>
    </div>
  )
}