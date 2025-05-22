// components/DataChecker.tsx
'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const requiredFields = ['nombre', 'apellido', 'edad', 'genero', 'telefono', 'tarifaId']

export const DataChecker = ({ userData }: { userData: any }) => {
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    if (!userData || hasChecked) return

    // Verificar si los campos requeridos tienen valores válidos
    const missingFields = requiredFields.filter(field => {
      const value = userData[field]
      return value === undefined || value === null || value === ''
    })

    if (missingFields.length > 0) {
      toast.error(
        <div>
          <p>Faltan datos en tu perfil:</p>
          <ul className="list-disc pl-4 mt-1">
            {missingFields.map(field => (
              <li key={field} className="capitalize">
                {field === 'tarifaId' ? 'tarifa' : field}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => window.location.href = 'home/profile'}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
          >
            Completar perfil
          </button>
        </div>,
        {
          id: 'missing-data', // ID único para evitar múltiples toasts
          duration: Infinity,
          position: 'bottom-right',
          style: {
            backgroundColor: '#fef3c7',
            color: '#92400e',
            maxWidth: '500px'
          }
        }
      )
      setHasChecked(true)
    } else {
      // Eliminar toast si existe
      toast.dismiss('missing-data')
    }
  }, [userData, hasChecked])

  return <Toaster />
}