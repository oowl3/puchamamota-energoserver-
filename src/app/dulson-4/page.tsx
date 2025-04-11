import React from 'react'
import Header_loguin from "@/app/components/elements/header/Header_loguin";
import Header_menu from '../components/elements/header/Header_menu';
const Dulson_4 = () => {
  return (
    <main>
      <Header_menu />

<section className="p-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-2">Añadir Dispositivo</h2>
  <p className="font-medium text-gray-700 mb-4">Procedimiento para añadir el nuevo dispositivo</p>

  <div className="flex flex-wrap gap-6">
    {/* Formulario */}
  <div className="bg-white border border-gray-300 shadow-md rounded p-4 w-full max-w-sm">
    {/* Código del dispositivo */}
  <label htmlFor="codigo" className="block text-sm text-gray-700">Código del Dispositivo</label>
  <input
    id="codigo"
    type="text"
    placeholder="Nombre"
    className="w-full mt-1 mb-3 px-3 py-2 border border-gray-300 rounded text-black"
  />

    {/* Grupo */}
  <label htmlFor="grupo" className="block text-sm text-gray-700">Grupo</label>
  <select
    id="grupo"
    className="w-full mt-1 mb-3 px-3 py-2 border border-gray-300 rounded text-black"
  >
    <option>Seleccionar</option>
  </select>

    {/* Botón */}
  <button className="w-20 h-20 rounded-full bg-gradient-to-b from-[#7d9918] to-[#5e6916] text-white text-sm mx-auto mt-2 block shadow-md">
    Verificar
  </button>
</div>

    {/* Pasos */}
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {/* Paso 1 */}
      <div className="max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-1">Paso 1</h3>
        <p className="text-sm text-gray-600 mb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non semper odio.
        </p>
        <div className="w-full h-36 border border-green-700 bg-gray-50" />
      </div>

      {/* Paso 2 */}
      <div className="max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-1">Paso 2</h3>
        <p className="text-sm text-gray-600 mb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non semper odio.
        </p>
        <div className="w-full h-36 border border-green-700 bg-gray-50" />
      </div>

      {/* Paso 3 */}
      <div className="max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-1">Paso 3</h3>
        <div className="w-full h-24 border border-green-700 bg-gray-50" />
      </div>
    </div>
  </div>
</section>
</main>
  )
}

export default Dulson_4