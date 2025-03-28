import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const usuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  edad: z.string().regex(/^\d+$/, "La edad debe ser un número entero positivo").transform(s => BigInt(s)),
  genero: z.string().min(1, "El género es requerido"),
  telefono: z.string().regex(/^\d+$/, "El teléfono debe contener solo dígitos").optional().transform(s => s ? BigInt(s) : undefined),
  tokenId: z.string().regex(/^\d+$/, "tokenId debe ser un número entero").optional().transform(s => s ? BigInt(s) : undefined),
  configuracionId: z.string().regex(/^\d+$/, "configuracionId debe ser un número entero").optional().transform(s => s ? BigInt(s) : undefined),
  rolId: z.string().regex(/^\d+$/, "rolId debe ser un número entero").optional().transform(s => s ? BigInt(s) : undefined),
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
      edad: nuevoUsuario.edad.toString(),
      telefono: nuevoUsuario.telefono?.toString(),
      tokenId: nuevoUsuario.tokenId?.toString(),
      configuracionId: nuevoUsuario.configuracionId?.toString(),
      rolId: nuevoUsuario.rolId?.toString(),
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany();

    // Convertir todos los BigInt a strings
    const usuariosConvertidos = usuarios.map(usuario => ({
      ...usuario,
      id: usuario.id.toString(),
      edad: usuario.edad.toString(),
      telefono: usuario.telefono?.toString(),
      tokenId: usuario.tokenId?.toString(),
      configuracionId: usuario.configuracionId?.toString(),
      rolId: usuario.rolId?.toString(),
    }));

    return NextResponse.json(usuariosConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}