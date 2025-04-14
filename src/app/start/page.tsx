"use client"
import React from 'react'
import { ThemeToggle } from '../components/ThemeToggle'
import Button_goole from '../components/elements/button/Button_google'

function Start() {
  return (
    <div className='min-h-screen font-[family-name:var(--font-geist-sans)]'>
        <div>
            <h1>Energoserver</h1>
            <Button_goole/>
        </div>

        <div className="fixed bottom-4 right-4">
            <ThemeToggle />
        </div>
    </div>
  )
}

export default Start