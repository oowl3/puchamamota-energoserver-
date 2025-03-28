// src/app/api/configuracion-alertas/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const configSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tiempo: z.number().int().nonnegative("El tiempo no puede ser negativo"),
  consumo: z.number().int().nonnegative("El consumo no puede ser negativo"),
  usuarioConfiguracionId: z.number().int().positive("ID de usuario inválido")
});

// GET: Obtener configuraciones
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');

    const configuraciones = await prisma.configuracionAlerta.findMany({
      where: usuarioId ? { usuarioConfiguracionId: BigInt(usuarioId) } : {},
      include: { usuarioConfiguracion: true }
    });

    return NextResponse.json(
      configuraciones.map(config => ({
        ...config,
        id: config.id.toString(),
        tiempo: config.tiempo.toString(),
        consumo: config.consumo.toString(),
        usuarioConfiguracion: {
          ...config.usuarioConfiguracion,
          id: config.usuarioConfiguracion.id.toString()
        }
      }))
    );

  } catch (error) {
    console.error("Error GET configuraciones:", error);
    return NextResponse.json(
      { error: "Error al obtener configuraciones" },
      { status: 500 }
    );
  }
}

// POST: Crear nueva configuración
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = configSchema.parse({
      ...body,
      tiempo: Number(body.tiempo),
      consumo: Number(body.consumo),
      usuarioConfiguracionId: Number(body.usuarioConfiguracionId)
    });

    // Verificar existencia del usuario
    const usuarioExiste = await prisma.usuarioConfiguracion.findUnique({
      where: { id: BigInt(validatedData.usuarioConfiguracionId) }
    });

    if (!usuarioExiste) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const nuevaConfig = await prisma.configuracionAlerta.create({
      data: {
        nombre: validatedData.nombre,
        tiempo: BigInt(validatedData.tiempo),
        consumo: BigInt(validatedData.consumo),
        usuarioConfiguracionId: BigInt(validatedData.usuarioConfiguracionId)
      }
    });

    return NextResponse.json(
      {
        ...nuevaConfig,
        id: nuevaConfig.id.toString(),
        tiempo: nuevaConfig.tiempo.toString(),
        consumo: nuevaConfig.consumo.toString(),
        usuarioConfiguracionId: nuevaConfig.usuarioConfiguracionId.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST configuración:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear configuración" }, { status: 500 });
  }
}