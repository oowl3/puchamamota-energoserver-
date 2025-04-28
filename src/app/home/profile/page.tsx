'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Footer_home from '../safe_components/footer/Footer_home'

const Profile = () => {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellido: '',
    edad: '',
    genero: '',
    telefono: '',
    tarifaId: '',
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [tarifas, setTarifas] = useState<Array<{ id: string; tarifa: string }>>([])

  useEffect(() => {
    if (!session) return

    const fetchData = async () => {
      try {
        // Obtener datos del usuario
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuario/${session.user.id}`,
          { cache: 'no-store' }
        )
        const userData = await userRes.json()

        // Obtener lista de tarifas
        const tarifasRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/lista_tarifa`)
        const tarifasData = await tarifasRes.json()

        // Actualizar estados
        setFormData({
          email: userData.email || '',
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          edad: userData.edad?.toString() || '',
          genero: userData.genero || '',
          telefono: userData.telefono || '',
          tarifaId: userData.tarifaId || '',
        })

        setTarifas(tarifasData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage('Error al cargar los datos 😓')
      }
    }

    fetchData()
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'telefono') {
      const cleanedValue = value.replace(/\D/g, '').slice(0, 10)
      setFormData(prev => ({ ...prev, [name]: cleanedValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.telefono.length !== 10) {
      setMessage('El teléfono debe tener 10 dígitos')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/usuario/${session?.user.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      const result = await res.json()
      if (res.ok) {
        setMessage('Perfil actualizado con éxito ✅')
      } else {
        setMessage(result.error || 'Error al actualizar 😓')
      }
    } catch (error) {
      console.error('Update error:', error)
      setMessage('Error de conexión 😓')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-18 bg-[var(--color-bg)] min-h-screen p-4">
      <h2 className="text-2xl font-normal mb-6 font-urbanist">Edita o Actualiza tu informacion en el siguiente formulario:</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-lg ml-4">
        <h5 className="font-urbanist font-normal text-[var(--color-v-4_1)] text-lg">Datos personales:</h5>
        <div>
          <p>Nombre(s)</p>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="p-2 border border-[var(--color-v-5)] rounded focus:shadow-lg  focus:outline-none transition-shadow duration-300"
            required
          />

          <p>Apellidos</p>
          <input
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            className="p-2 border border-[var(--color-v-5)] rounded focus:shadow-lg  focus:outline-none transition-shadow duration-300"
            required
          />

          <p>Edad</p>
          <input
            name="edad"
            type="number"
            value={formData.edad}
            onChange={handleChange}
            placeholder="Edad"
            min="1"
            max="120"
            className="p-2 border border-[var(--color-v-5)] rounded focus:shadow-lg  focus:outline-none transition-shadow duration-300"
            required
          />

          <p>Genero</p>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            className="p-2 border border-[var(--color-v-5)] rounded focus:shadow-lg  focus:outline-none transition-shadow duration-300"
            required
          >
            <option value="" className="bg-[var(--color-bg)]">Selecciona tu género</option>
            <option value="H" className="bg-[var(--color-bg)]">Masculino</option>
            <option value="F" className="bg-[var(--color-bg)]">Femenino</option>
          </select>
        </div>


        <div className="w-full h-px" style={{ backgroundColor: 'var(--color-v-4)' }} />


        <h5 className="font-urbanist font-normal text-[var(--color-v-4_1)] text-lg">Datos de consumo eletrico:</h5>
        <div>
          <p>Tarifa</p>
          <select
            name="tarifaId"
            value={formData.tarifaId}
            onChange={handleChange}
            className="p-2 border border-[var(--color-v-5)]  rounded focus:shadow-lg  focus:outline-none transition-shadow duration-300"
            required
          >
            <option value="" className="bg-[var(--color-bg)]">Selecciona una tarifa</option>
            {tarifas.map((tarifa) => (
              <option key={tarifa.id} value={tarifa.id} className="bg-[var(--color-bg)]">
                {tarifa.tarifa}
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-full h-px" style={{ backgroundColor: 'var(--color-v-4)' }} />

        
        <h5 className="font-urbanist font-normal text-[var(--color-v-4_1)] text-lg">Datos de contacto:</h5>
        <div>
          <div className="relative w-full">
            <p>Teléfono</p>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-v-5))]">+52</span>
              <input
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="pl-12 p-2 w-1/2 border border-[var(--color-v-5)] rounded focus:shadow-lg  focus:outline-none transition-shadow duration-300"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                title="Ingrese 10 dígitos sin espacios ni guiones"
              />
            </div>
            {formData.telefono.length !== 10 && formData.telefono.length > 0 && (
              <p className="mt-1 text-red-500 text-sm">
                El teléfono debe tener exactamente 10 dígitos
              </p>
            )}
          </div>

          <p>Correo</p>
          <input
            name="email"
            type="email"
            value={formData.email}
            disabled
            placeholder="Correo electrónico"
            className="p-2 w-full border rounded bg-[var(--color-v-6_1)] text-gray-700 focus:outline-none border-[var(--color-v-5)]"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[var(--color-v-4_1)] text-white px-4 py-2 rounded-full  disabled:opacity-60
                     transition-colors duration-200 cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-sm ${message.includes('éxito') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <Footer_home />
    </div>
  )
}

export default Profile