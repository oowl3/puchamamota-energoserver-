// src/app/api/configuracion-alertas/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const configSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tiempo: z.number().int().nonnegative("El tiempo no puede ser negativo"),
  consumo: z.number().int().nonnegative("El consumo no puede ser negativo"),
  usuarioConfiguracionId: z.number().int().positive("ID de usuario inválido"),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const configuracion = await prisma.configuracionAlerta.findUnique({
      where: { id: BigInt(id) },
      include: { usuarioConfiguracion: true },
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
        id: configuracion.usuarioConfiguracion.id.toString(),
      },
    });
  } catch (error) {
    console.error("Error GET configuración por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const validatedData = configSchema.parse({
      ...body,
      tiempo: Number(body.tiempo),
      consumo: Number(body.consumo),
      usuarioConfiguracionId: Number(body.usuarioConfiguracionId),
    });

    const configExistente = await prisma.configuracionAlerta.findUnique({
      where: { id: BigInt(id) },
    });

    if (!configExistente) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    const usuarioExiste = await prisma.usuarioConfiguracion.findUnique({
      where: { id: BigInt(validatedData.usuarioConfiguracionId) },
    });

    if (!usuarioExiste) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const configActualizada = await prisma.configuracionAlerta.update({
      where: { id: BigInt(id) },
      data: {
        nombre: validatedData.nombre,
        tiempo: BigInt(validatedData.tiempo),
        consumo: BigInt(validatedData.consumo),
        usuarioConfiguracionId: BigInt(validatedData.usuarioConfiguracionId),
      },
    });

    return NextResponse.json({
      ...configActualizada,
      id: configActualizada.id.toString(),
      tiempo: configActualizada.tiempo.toString(),
      consumo: configActualizada.consumo.toString(),
      usuarioConfiguracionId: configActualizada.usuarioConfiguracionId.toString(),
    });
  } catch (error) {
    console.error("Error PUT configuración:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error al actualizar configuración" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const configExistente = await prisma.configuracionAlerta.findUnique({
      where: { id: BigInt(id) },
    });

    if (!configExistente) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    await prisma.configuracionAlerta.delete({
      where: { id: BigInt(id) },
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