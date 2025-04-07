"use client"
import React from 'react'
import Header_loguin from '../components/elements/header/Header_loguin'
import { ThemeToggle } from '../components/ThemeToggle'

function Home() {
  return (
    <div className='min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <Header_loguin/>
      <div>
        <h1>Energoserver</h1>
      </div>
      <div>

      </div>

      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Home