// app/api/usuario-token/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Esquemas de validación
const tokenIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID debe ser un número válido")
});

const updateTokenSchema = z.object({
  token: z.string().min(10, "El token debe tener al menos 10 caracteres").optional()
});

// GET - Obtener token por ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { id: validId } = tokenIdSchema.parse({ id });
    const tokenId = BigInt(validId);
    
    const token = await prisma.usuarioToken.findUnique({
      where: { id: tokenId },
      include: { usuarios: true }
    });

    if (!token) {
      return NextResponse.json(
        { error: "Token no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...token,
      id: token.id.toString(),
      usuarios: token.usuarios.map(usuario => ({
        ...usuario,
        id: usuario.id.toString()
      }))
    });
  } catch (error) {
    console.error("Error GET token:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener token" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar token
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { id: validId } = tokenIdSchema.parse({ id });
    const tokenId = BigInt(validId);
    
    const body = await request.json();
    const validatedData = updateTokenSchema.parse(body);

    const tokenActualizado = await prisma.usuarioToken.update({
      where: { id: tokenId },
      data: validatedData,
      include: { usuarios: true }
    });

    return NextResponse.json({
      ...tokenActualizado,
      id: tokenActualizado.id.toString(),
      usuarios: tokenActualizado.usuarios.map(u => ({
        ...u,
        id: u.id.toString()
      }))
    });
  } catch (error) {
    console.error("Error PUT token:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: "Token no encontrado" },
        { status: 404 }
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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { id: validId } = tokenIdSchema.parse({ id });
    const tokenId = BigInt(validId);
    
    await prisma.usuarioToken.delete({
      where: { id: tokenId }
    });

    return NextResponse.json(
      null,
      { status: 204 }
    );
  } catch (error) {
    console.error("Error DELETE token:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
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