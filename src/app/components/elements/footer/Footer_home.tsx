import React from 'react'
import IconProp from '../../IconProp'
import Link from 'next/link';

const Footer_home = () => {
  return (
    <div>
        <footer className=" pt-8">
            <div className='flex items-center space-x-4'>
                <div className="p-4 ">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8">
                            <IconProp className="p-1" />
                        </div>
                        <h6>Energoserver</h6>
                    </div>
                    <p>Copyright 2025 ©</p>
                    <p>Energoserver, All rights reserved.</p>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: 'var(--color-v-4)' }}></div>
                <div className="p-4">
                    <h6 className="text-sm font-urbanist text-[var(--color-text)]">Contacto:</h6>
                    <p className="mt-2 text-[var(--color-text)]">support@energoserver.mx</p>
                </div>
                <Link href="/faq" className="font-urbanist font-normal text-[var(--color-text)] hover:underline transition-colors duration-200">
                    <u>Ayuda</u>
                </Link>
            </div>
        </footer>
    </div>
  )
}

export default Footer_home