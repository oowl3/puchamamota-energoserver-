// lib/validateUserData.ts
interface UserData {
  nombre: string
  apellido?: string | null
  edad?: bigint | number | null
  genero?: string | null
  telefono?: string | null
}

// Campos actualizados para incluir todos los requeridos
const requiredFields: (keyof UserData)[] = [
  'apellido',
  'telefono',
  'genero',
  'edad'
]

export function isUserDataIncomplete(user: UserData): boolean {
  return requiredFields.some(field => {
    const value = user[field]
    
    if (field === 'edad') {
      return !value || Number(value) <= 0
    }

    return !value || (typeof value === 'string' && value.trim() === '')
  })
}