// src/app/api/usuarios/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const usuarioSchema = z.object({
  email: z.string().email("Email inválido"),
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().optional().nullable(),
  edad: z.coerce.bigint().optional().nullable(),
  genero: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  tarifaId: z.coerce.bigint(),
  configuracionId: z.coerce.bigint().optional().nullable(),
  rolId: z.coerce.bigint().optional().nullable()
});

// GET Todos los usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        configuracion: true,
        rol: true,
        grupos: true,
        listaTarifa: true
      }
    });

    return NextResponse.json(
      usuarios.map(u => ({
        ...u,
        id: u.id.toString(),
        tarifaId: u.tarifaId.toString(),
        configuracionId: u.configuracionId?.toString() ?? null,
        rolId: u.rolId?.toString() ?? null,
        edad: u.edad?.toString() ?? null,
        configuracion: u.configuracion ? {
          ...u.configuracion,
          id: u.configuracion.id.toString()
        } : null,
        rol: u.rol ? {
          ...u.rol,
          id: u.rol.id.toString()
        } : null,
        grupos: u.grupos.map(g => ({
          ...g,
          id: g.id.toString()
        })),
        listaTarifa: {
          ...u.listaTarifa,
          id: u.listaTarifa.id.toString()
        }
      }))
    );

  } catch (error) {
    console.error("Error GET usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

// POST Nuevo usuario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = usuarioSchema.parse(body);
    
    const nuevoUsuario = await prisma.usuario.create({
      data: validatedData
    });

    return NextResponse.json(
      {
        ...nuevoUsuario,
        id: nuevoUsuario.id.toString(),
        tarifaId: nuevoUsuario.tarifaId.toString(),
        configuracionId: nuevoUsuario.configuracionId?.toString() ?? null,
        rolId: nuevoUsuario.rolId?.toString() ?? null,
        edad: nuevoUsuario.edad?.toString() ?? null
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST usuario:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}