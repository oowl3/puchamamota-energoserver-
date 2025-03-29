// src/app/api/configuracion-alertas/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const alertaSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tiempo: z.number().int().nonnegative("El tiempo no puede ser negativo"),
  consumo: z.number().int().nonnegative("El consumo no puede ser negativo"),
  usuarioConfiguracionId: z.number().int().positive("ID de usuario inválido")
});

// GET: Obtener configuración por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const configuracion = await prisma.configuracionAlerta.findUnique({
      where: { id: BigInt(params.id) },
      include: { usuarioConfiguracion: true }
    });

    if (!configuracion) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...configuracion,
      id: configuracion.id.toString(),
      tiempo: configuracion.tiempo.toString(),
      consumo: configuracion.consumo.toString(),
      usuarioConfiguracion: {
        ...configuracion.usuarioConfiguracion,
        id: configuracion.usuarioConfiguracion.id.toString()
      }
    });

  } catch (error) {
    console.error("Error GET configuración:", error);
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar configuración
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = alertaSchema.parse({
      ...body,
      tiempo: Number(body.tiempo),
      consumo: Number(body.consumo),
      usuarioConfiguracionId: Number(body.usuarioConfiguracionId)
    });

    const configActualizada = await prisma.configuracionAlerta.update({
      where: { id: BigInt(params.id) },
      data: {
        nombre: validatedData.nombre,
        tiempo: BigInt(validatedData.tiempo),
        consumo: BigInt(validatedData.consumo),
        usuarioConfiguracionId: BigInt(validatedData.usuarioConfiguracionId)
      }
    });

    return NextResponse.json({
      ...configActualizada,
      id: configActualizada.id.toString(),
      tiempo: configActualizada.tiempo.toString(),
      consumo: configActualizada.consumo.toString(),
      usuarioConfiguracionId: configActualizada.usuarioConfiguracionId.toString()
    }, { status: 200 });

  } catch (error) {
    console.error("Error PUT configuración:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al actualizar configuración" }, { status: 500 });
  }
}

// DELETE: Eliminar configuración
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.configuracionAlerta.delete({
      where: { id: BigInt(params.id) }
    });

    return NextResponse.json(
      { message: "Configuración eliminada correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE configuración:", error);
    return NextResponse.json(
      { error: "Error al eliminar configuración" },
      { status: 500 }
    );
  }
}