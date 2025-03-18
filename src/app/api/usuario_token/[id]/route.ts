// app/api/usuario-token/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización
const updateTokenSchema = z.object({
  token: z.string().min(10, "El token debe tener al menos 10 caracteres").optional()
});

// GET - Obtener token por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    
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
    return NextResponse.json(
      { error: "Error al obtener token" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar token
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    const body = await request.json();
    const validatedData = updateTokenSchema.parse(body);

    const tokenActualizado = await prisma.usuarioToken.update({
      where: { id },
      data: validatedData
    });

    const responseData = {
      ...tokenActualizado,
      id: tokenActualizado.id.toString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en PUT:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar token" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar token
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = BigInt(resolvedParams.id);
    
    await prisma.usuarioToken.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: "Token no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar token" },
      { status: 500 }
    );
  }
}