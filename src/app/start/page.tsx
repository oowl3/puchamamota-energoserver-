"use client"
import React from 'react'
import Header_loguin from '../components/elements/header/Header_loguin'
import { ThemeToggle } from '../components/ThemeToggle'
import Button_goole from '../components/elements/button/Button_google'

function Start() {
  return (
    <div className='min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <Header_loguin/>
      <div>
        <h1>Hola</h1>
      </div>
      <div>
       <Button_goole/>
      </div>

      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Start