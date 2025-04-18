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
                    <h6 className='text-sm font-urbanist text-[var(--color-text)]'>Contacto:</h6>
                    <p className='mt-2 text-[var(--color-text)]'>support@energoserver.mx</p>
                </div>
                <div className='w-px h-10' style={{ backgroundColor: 'var(--color-v-4)' }}></div>
                <div className='p-4'>
                    <h6 className='text-sm font-urbanist text-[var(--color-text)]'>Ayuda</h6>
                    <Link href="/faq" className='hover:underline transition-colors duration-200'>
                        <p className='mt-2'>Preguntas frecuentes</p>
                    </Link>
                    <Link href="/dulson" className='hover:underline transition-colors duration-200'>
                        <p className='mt-2'>H</p>
                    </Link>
                    <Link href="/dulson-2" className='hover:underline transition-colors duration-200'>
                        <p className='mt-2'>O</p>
                    </Link>
                    <Link href="/dulson-3" className='hover:underline transition-colors duration-200'>
                        <p className='mt-2'>L</p>
                    </Link>
                    <Link href="/dulson-4" className='hover:underline transition-colors duration-200'>
                        <p className='mt-2'>A</p>
                    </Link>
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer_home