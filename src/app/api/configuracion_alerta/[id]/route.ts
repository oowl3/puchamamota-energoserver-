// src/app/api/configuracion-alertas/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const configSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  tiempo: z.number().int().nonnegative("El tiempo no puede ser negativo"),
  consumo: z.number().int().nonnegative("El consumo no puede ser negativo"),
  usuarioConfiguracionId: z.number().int().positive("ID de usuario inválido")
});

// Tipos TypeScript
type ParamsType = {
  params: { [key: string]: string | string[] };
};

type ConfigResponse = {
  id: string;
  nombre: string;
  tiempo: string;
  consumo: string;
  usuarioConfiguracionId: string;
  usuarioConfiguracion?: {
    id: string;
    [key: string]: unknown;
  };
};

// GET: Obtener configuración por ID
export async function GET(
  request: NextRequest,
  { params }: ParamsType
): Promise<NextResponse<ConfigResponse | { error: string }>> {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID de configuración inválido" },
        { status: 400 }
      );
    }

    const configuracion = await prisma.configuracionAlerta.findUnique({
      where: { id: BigInt(id) },
      include: { usuarioConfiguracion: true }
    });

    if (!configuracion) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    const responseData: ConfigResponse = {
      id: configuracion.id.toString(),
      nombre: configuracion.nombre,
      tiempo: configuracion.tiempo.toString(),
      consumo: configuracion.consumo.toString(),
      usuarioConfiguracionId: configuracion.usuarioConfiguracionId.toString(),
      usuarioConfiguracion: {
        id: configuracion.usuarioConfiguracion.id.toString()
      }
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error GET configuración por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener la configuración" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar configuración completa
export async function PUT(
  request: NextRequest,
  { params }: ParamsType
): Promise<NextResponse<ConfigResponse | { error: string }>> {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID de configuración inválido" },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();
    const validatedData = configSchema.parse({
      ...(body as Record<string, unknown>),
      tiempo: Number((body as { tiempo?: unknown }).tiempo),
      consumo: Number((body as { consumo?: unknown }).consumo),
      usuarioConfiguracionId: Number((body as { usuarioConfiguracionId?: unknown }).usuarioConfiguracionId)
    });

    const configExistente = await prisma.configuracionAlerta.findUnique({
      where: { id: BigInt(id) }
    });

    if (!configExistente) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    const usuarioExiste = await prisma.usuarioConfiguracion.findUnique({
      where: { id: BigInt(validatedData.usuarioConfiguracionId) }
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
        usuarioConfiguracionId: BigInt(validatedData.usuarioConfiguracionId)
      }
    });

    const responseData: ConfigResponse = {
      id: configActualizada.id.toString(),
      nombre: configActualizada.nombre,
      tiempo: configActualizada.tiempo.toString(),
      consumo: configActualizada.consumo.toString(),
      usuarioConfiguracionId: configActualizada.usuarioConfiguracionId.toString()
    };

    return NextResponse.json(responseData);

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

// DELETE: Eliminar configuración
export async function DELETE(
  request: NextRequest,
  { params }: ParamsType
): Promise<NextResponse<{ message: string } | { error: string }>> {
  try {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "ID de configuración inválido" },
        { status: 400 }
      );
    }

    const configExistente = await prisma.configuracionAlerta.findUnique({
      where: { id: BigInt(id) }
    });

    if (!configExistente) {
      return NextResponse.json(
        { error: "Configuración no encontrada" },
        { status: 404 }
      );
    }

    await prisma.configuracionAlerta.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json(
      { message: "Configuración eliminada correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE configuración:", error);
    return NextResponse.json(
      { error: "Error al eliminar la configuración" },
      { status: 500 }
    );
  }
}