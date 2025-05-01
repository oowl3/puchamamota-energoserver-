"use client";
import React, { useState } from "react";
import IconProp from "../../IconProp";
import Link from "next/link";
import Button_clasic from "../button/button_clasic";

const Header_menu = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-[var(--color-bg)] backdrop-blur-md shadow-lg z-50 ">
      {/* Barra Superior */}
      <div className="flex items-center justify-between px-4 py-2 ">
        <div className="flex items-center gap-5 ">
          <button onClick={() => setOpen(true)}>
            <span className="material-icons text-[var(--color-v-1)] cursor-pointer">
              menu
            </span>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <IconProp />
            </div>
            <h3 className="font-bold uppercase tracking-wider font-k2d text-[var(--color-text)]">
              ENERGOSERVER
            </h3>
          </Link>
        </div>
        <Link href="/" className="block w-11 h-11 group">
          <Button_clasic>
            <span className="material-icons text-white text-xl transition-all group-hover:translate-y-[-0.25rem]">
              person_apron
            </span>
            <h6 className="font-urbanist font-normal text-white text-[0.5rem] absolute bottom-[-0.75rem] opacity-0 group-hover:opacity-100 transition-opacity">
              perfil
            </h6>
          </Button_clasic>
        </Link>
      </div>

      {/* Menú circular */}
      <div
        className={`
          fixed top-[-3rem] left-[-8rem]  
          transition-transform duration-300 ease-in-out 
          z-50
          ${open ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"}
        `}
        style={{
          width: "30rem",
          height: "30rem",
          borderRadius: "50%",
          backgroundColor: "var(--color-v-1)",
          // Puedes remover el overflow si está recortando el botón
          // overflow: "hidden",
        }}
      >
        <div className="relative w-full h-full">
          {/* Botón de cierre */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-1 right-4 text-4xl text-white hover:scale-110 transition-transform z-[60]"
          >
            <span className="material-icons cursor-pointer" style={{ color: "var(--color-text)" }}>close</span>
          </button>

          {/* Opciones del menú */}
          <nav className="mt-30 flex flex-col gap-4 font-bold font-urbanist text-white " >
            <div className="underline">
            <h4 className="pl-33 ; ">Menu</h4>
            </div>
            <Link href="/dulson-2" className="hover:underline pl-50">
              Inicio
            </Link>
            <Link href="/dulson-3" className="hover:underline pl-50">
              Mis Grupos
            </Link>
            <Link href="/" className="hover:underline pl-50">
              Historial
            </Link>
            <Link href="/" className="hover:underline pl-50">
              Notificaciones
            </Link>
            <Link href="/dulson-4" className="hover:underline pl-50">
              Añadir Dispositivo
            </Link>
            <Link href="/faq" className="underline pl-55 fixed top-95 text-2xl">
              Ayuda
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header_menu;
