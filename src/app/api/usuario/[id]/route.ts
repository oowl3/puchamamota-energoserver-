import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Cabeceras CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Esquema de validación para ID
const idSchema = z.string().regex(/^\d+$/, "ID debe ser un número válido");

// Esquema de validación para actualización
const usuarioUpdateSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  apellido: z.string().min(1, "El apellido es requerido").optional(),
  edad: z.string().regex(/^\d+$/, "La edad debe ser un número entero positivo").transform(Number).optional(),
  genero: z.string().min(1, "El género es requerido").optional(),
  telefono: z.string().regex(/^\d+$/, "El teléfono debe contener solo dígitos").optional().transform(Number),
  tokenId: z.string().regex(/^\d+$/, "tokenId debe ser un número entero").optional().transform(Number),
  configuracionId: z.string().regex(/^\d+$/, "configuracionId debe ser un número entero").optional().transform(Number),
  rolId: z.string().regex(/^\d+$/, "rolId debe ser un número entero").optional().transform(Number),
});

// GET: Obtener usuario por ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    // Validar ID con Zod
    const validatedId = idSchema.parse(resolvedParams.id);
    const id = BigInt(validatedId);

    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Convertir BigInt a string
    const usuarioConvertido = {
      ...usuario,
      id: usuario.id.toString(),
      edad: usuario.edad.toString(),
      telefono: usuario.telefono?.toString(),
      tokenId: usuario.tokenId?.toString(),
      configuracionId: usuario.configuracionId?.toString(),
      rolId: usuario.rolId?.toString(),
    };

    return NextResponse.json(usuarioConvertido, { headers: corsHeaders });

  } catch (error) {
    console.error("Error en GET /api/usuarios/[id]:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT: Actualizar usuario por ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const [resolvedParams, body] = await Promise.all([
      params,
      request.json()
    ]);
    
    // Validar ID con Zod
    const validatedId = idSchema.parse(resolvedParams.id);
    const id = BigInt(validatedId);

    // Validar cuerpo con Zod
    const validatedData = usuarioUpdateSchema.parse(body);

    // Verificar existencia del usuario
    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });
    if (!usuarioExistente) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404, headers: corsHeaders }
      );
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: validatedData
    });

    // Convertir BigInt a string
    const responseData = {
      ...usuarioActualizado,
      id: usuarioActualizado.id.toString(),
      edad: usuarioActualizado.edad.toString(),
      telefono: usuarioActualizado.telefono?.toString(),
      tokenId: usuarioActualizado.tokenId?.toString(),
      configuracionId: usuarioActualizado.configuracionId?.toString(),
      rolId: usuarioActualizado.rolId?.toString(),
    };

    return NextResponse.json(responseData, { headers: corsHeaders });

  } catch (error) {
    console.error("Error en PUT /api/usuarios/[id]:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE: Eliminar usuario por ID
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    // Validar ID con Zod
    const validatedId = idSchema.parse(resolvedParams.id);
    const id = BigInt(validatedId);

    // Verificar existencia del usuario
    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });
    if (!usuarioExistente) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404, headers: corsHeaders }
      );
    }

    await prisma.usuario.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Usuario eliminado correctamente" },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Error en DELETE /api/usuarios/[id]:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500, headers: corsHeaders }
    );
  }
}