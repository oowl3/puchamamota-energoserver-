"use client";
import React, { useState, useRef, useEffect } from "react";
import { signOut } from 'next-auth/react'
import IconProp from "../../../components/IconProp";
import Link from "next/link";
import Button_signout from "../ui/Button_signout";
import Button_clasic from "../ui/button_clasic";

const Header_home = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-[var(--color-bg)] backdrop-blur-md shadow-lg z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/home" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <IconProp />
          </div>
          <h3 className="font-bold uppercase tracking-wider font-k2d text-[var(--color-text)]">
            ENERGOSERVER
          </h3>
        </Link>

        <PerfilDropdown />
      </div>
    </header>
  );
};

const PerfilDropdown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-white"
      >
        <Button_clasic>
          <div className="flex flex-col items-center justify-center gap-[2px] w-full  text-white">
            <span className="material-symbols-outlined text-[1.3rem] leading-none">person_apron</span>
            <span className="text-[0.5rem] font-medium">Perfil</span>
          </div>
        </Button_clasic>
      </button>

      {open && (
      <div className="absolute top-full right-0 mt-2 w-44 bg-[var(--color-v-6)] shadow-xl rounded-lg overflow-hidden z-50 animate-fade-in text-center">
        <Link
          href="/home/profile"
          onClick={() => setOpen(false)}
          className="block w-full px-4 py-2 text-sm hover:bg-[var(--color-v-5_1)]"
        >
          <p className="mx-auto">Ir al perfil</p>
        </Link>

        <div className="border-t border-gray-300" />

        <button
          onClick={() => signOut({ callbackUrl: '/start' })}
          className="block w-full text-sm px-4 py-2 hover:bg-[var(--color-v-5_1)] cursor-pointer"
        >
          <p className="mx-auto">Cerrar sesión</p>
        </button>
      </div>
    )}
    </div>
  );
};

export default Header_home;