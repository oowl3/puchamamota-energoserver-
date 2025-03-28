// app/api/usuario-token/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Esquema para validación
const updateTokenSchema = z.object({
  token: z.string().min(10, "El token debe tener al menos 10 caracteres").optional()
});

// GET - Obtener token por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    
    const token = await prisma.usuarioToken.findUnique({
      where: { id },
      include: { usuarios: true }
    });

    if (!token) {
      return NextResponse.json(
        { error: "Token no encontrado" },
        { status: 404 }
      );
    }

    // Convertir BigInt a string para serialización
    const responseData = {
      ...token,
      id: token.id.toString(),
      usuarios: token.usuarios.map(usuario => ({
        ...usuario,
        id: usuario.id.toString()
      }))
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en GET por ID:", error);
    
    if (error instanceof TypeError) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error interno al obtener token" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar token
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    const body = await request.json();
    const validatedData = updateTokenSchema.parse(body);

    const tokenActualizado = await prisma.usuarioToken.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json({
      ...tokenActualizado,
      id: tokenActualizado.id.toString()
    });
  } catch (error) {
    console.error("Error en PUT:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validación fallida",
          detalles: error.errors.map(e => ({
            campo: e.path.join('.'),
            mensaje: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Token no encontrado" },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Error interno al actualizar token" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar token
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    
    await prisma.usuarioToken.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Token no encontrado" },
          { status: 404 }
        );
      }
    }
    
    if (error instanceof TypeError) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error interno al eliminar token" },
      { status: 500 }
    );
  }
}