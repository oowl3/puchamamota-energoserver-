"use client"
import React from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import Button_goole from '../components/elements/button/Button_google'
import Link from 'next/link';

function Start() {
  return (
<div className='min-h-screen font-[family-name:var(--font-geist-sans)] grid grid-cols-3'>
  <div className='col-span-2'>
      <Link href="/">
        <h1 className="tracking-[0.2em]">Energoserver</h1>
      </Link>
  </div>
  

  <div className="col-span-1 p-4 text-white flex flex-col items-center text-center space-y-2 bg-[var(--color-v-1_1)]">
    <h3 className="font-urbanist font-normal">Unete al ahorro</h3>
    <h4 className="font-urbanist font-normal">Monitorea y ahorra</h4>
    <h4 className="font-urbanist font-normal">Energía fácilmente</h4>
    <div className="w-24 h-px bg-[var(--color-v-1)]"></div>
    <Button_goole />
    <div>
      <Link href="/info" className='hover:underline transition-colors duration-200'>
        <p className='mt-2'>Politica de privacidad.</p>
      </Link>
    </div>
  </div>
  <div className="fixed bottom-4 right-4">
   <ThemeToggle />
  </div>
</div>
  )
}

export default Start
