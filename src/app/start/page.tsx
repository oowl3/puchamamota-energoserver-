"use client"
import React from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import Button_goole from '../components/elements/button/Button_google'
import Link from 'next/link';

function Start() {
  return (
<div className='min-h-screen font-[family-name:var(--font-geist-sans)] grid grid-cols-3 bg-[var(--color-bg-1)]'>
<div className='col-span-2 '>
  <Link href="/">
    <h1 className="tracking-[0.3em] font-normal ml-5">ENERGOSERVER</h1>
  </Link>

  <img src="https://picsum.photos/200/300.webp" alt="Imagen mágica" className="w-150 h-70 mt-3 mx-auto"/>

  <div className='ml-5 mt-5 space-y-3'>
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rotate-90">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[var(--color-v-1)]"></div>
      </div>
      <h3 className="font-urbanist font-normal">Registra tu consumo</h3>
    </div>

    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rotate-90">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[var(--color-v-1)]"></div>
      </div>
      <h3 className="font-urbanist font-normal">Ahorra dinero</h3>
    </div>

    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rotate-90">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[20px] border-l-transparent border-r-transparent border-b-[var(--color-v-1)]"></div>
      </div>
      <h3 className="font-urbanist font-normal">Cuida el planeta desde un lugar</h3>
    </div>
  </div>

</div>

  

  <div className="col-span-1 p-4 text-white flex flex-col justify-between text-center bg-[var(--color-v-1_1)] h-full min-h-[500px]">
    <div className="flex flex-col items-center space-y-2 mt-6">
      <h3 className="font-urbanist font-normal">Unete al ahorro</h3>
      <h4 className="font-urbanist font-normal">Monitorea y ahorra</h4>
      <h4 className="font-urbanist font-normal">Energía fácilmente</h4>
      <div className="w-full h-px bg-[var(--color-v-5)]"></div>
    </div>


    <div className="flex flex-col items-center">
      <Button_goole />
      <Button_goole />
      <div className='relative w-11 h-11 my-4'>
        <div className="absolute w-8.25 h-8.25 rounded-full bg-[var(--color-v-2)]"></div>
      </div>
    </div>


    <div className="font-anonymous text-justify text-sm mt-4">
      <div className="w-full h-px bg-[var(--color-v-5)]"></div>
      <p>
        <span>Al continuar aceptas nuestros </span>
        <Link href="/info" className="hover:underline transition-colors duration-200 cursor-pointer">
          <u className='text-[var(--color-v-2)]'><span className="text-[var(--color-v-2)]">Términos</span></u>
        </Link>
        <span> y </span>
        <Link href="/info" className="hover:underline transition-colors duration-200 cursor-pointer">
          <u className='text-[var(--color-v-2)]'><span className="text-[var(--color-v-2)]">Políticas</span></u>
        </Link>
        <span> para ofrecerte una mejor experiencia.</span>
      </p>
    </div>
  </div>

  <div className="fixed bottom-4 right-4">
   <ThemeToggle />
  </div>
</div>
  )
}

export default Start
