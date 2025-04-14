import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  apellido: z.string().nullish(),
  edad: z.string()
    .regex(/^\d+$/, "La edad debe ser un número entero positivo")
    .transform(val => BigInt(val))
    .optional()
    .nullable(),
  genero: z.string().nullish(),
  telefono: z.string().nullish(),
  configuracionId: z.string()
    .regex(/^\d+$/, "ID de configuración inválido")
    .transform(val => BigInt(val))
    .optional()
    .nullable(),
  rolId: z.string()
    .regex(/^\d+$/, "ID de rol inválido")
    .transform(val => BigInt(val))
    .optional()
    .nullable()
});

// POST - Crear nuevo usuario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = usuarioSchema.parse(body);

    const nuevoUsuario = await prisma.usuario.create({
      data: validatedData
    });

    // Convertir BigInt a string para la respuesta
    const responseData = {
      ...nuevoUsuario,
      id: nuevoUsuario.id.toString(),
      edad: nuevoUsuario.edad?.toString() ?? null,
      configuracionId: nuevoUsuario.configuracionId?.toString() ?? null,
      rolId: nuevoUsuario.rolId?.toString() ?? null
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany();

    // Convertir todos los BigInt a strings
    const usuariosConvertidos = usuarios.map((usuario) => ({
      ...usuario,
      id: usuario.id.toString(),
      edad: usuario.edad?.toString() ?? null,
      configuracionId: usuario.configuracionId?.toString() ?? null,
      rolId: usuario.rolId?.toString() ?? null
    }));

    return NextResponse.json(usuariosConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener los usuarios" },
      { status: 500 }
    );
  }
}