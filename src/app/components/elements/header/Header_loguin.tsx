"use client";
import React from "react";
import IconProp from "../../IconProp";
import Link from "next/link";
import Button_clasic from "../button/button_clasic";

const Header_loguin = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-[var(--color-bg)] backdrop-blur-md shadow-lg z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <IconProp />
          </div>

          <h3 className="font-bold uppercase tracking-wider font-k2d text-[var(--color-text)] ">
            ENERGOSERVER
          </h3>
        </Link>
        
        <Link href="/" className='block w-11 h-11 group'>
          <Button_clasic>
            <span className="material-icons text-white text-xl transition-all group-hover:translate-y-[-0.25rem]">person_apron</span>
            <h6 className="font-urbanist font-normal text-white text-[0.5rem] absolute bottom-[-0.75rem] opacity-0 group-hover:opacity-100 transition-opacity">
              perfil
            </h6>
          </Button_clasic>
        </Link>
      </div>
    </header>
  );
};
//        
export default Header_loguin;