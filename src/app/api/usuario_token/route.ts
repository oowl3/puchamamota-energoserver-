// app/api/usuario-token/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const usuarioTokenSchema = z.object({
  token: z.string().min(10, "El token debe tener al menos 10 caracteres")
});

// POST - Crear nuevo token
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = usuarioTokenSchema.parse(body);

    const nuevoToken = await prisma.usuarioToken.create({
      data: {
        token: validatedData.token
      }
    });

    const responseData = {
      ...nuevoToken,
      id: nuevoToken.id.toString()
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al crear token" },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los tokens
export async function GET() {
  try {
    const tokens = await prisma.usuarioToken.findMany({
      include: {
        usuarios: true
      }
    });

    const tokensConvertidos = tokens.map((token) => ({
      ...token,
      id: token.id.toString(),
      usuarios: token.usuarios.map(usuario => ({
        ...usuario,
        id: usuario.id.toString()
      }))
    }));

    return NextResponse.json(tokensConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener tokens" },
      { status: 500 }
    );
  }
}