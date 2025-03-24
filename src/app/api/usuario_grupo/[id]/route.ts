// app/api/grupos/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema para validación de actualización
const updateGrupoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  dispositivoAsignadoId: z.string()
    .min(1, "Se requiere ID de dispositivo")
    .regex(/^\d+$/, "Debe ser un número entero positivo")
    .optional(),
  historialId: z.string()
    .regex(/^\d+$/, "Debe ser un número entero positivo")
    .optional()
    .nullable()
});

// GET - Obtener grupo por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const grupo = await prisma.usuarioGrupo.findUnique({
      where: { id: BigInt(id) },
      include: {
        dispositivo: true,
        historial: true,
        usuarios: true
      }
    });

    if (!grupo) {
      return NextResponse.json(
        { error: "Grupo no encontrado" },
        { status: 404 }
      );
    }

    // Convertir todos los BigInt a strings
    const grupoConvertido = {
      ...grupo,
      id: grupo.id.toString(),
      dispositivoAsignadoId: grupo.dispositivoAsignadoId.toString(),
      historialId: grupo.historialId?.toString() || null,
      dispositivo: grupo.dispositivo ? {
        ...grupo.dispositivo,
        id: grupo.dispositivo.id.toString()
      } : null,
      historial: grupo.historial ? {
        ...grupo.historial,
        id: grupo.historial.id.toString()
      } : null,
      usuarios: grupo.usuarios.map(usuario => ({
        ...usuario,
        id: usuario.id.toString()
      }))
    };

    return NextResponse.json(grupoConvertido);
  } catch (error) {
    console.error("Error en GET por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener el grupo" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar grupo
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateGrupoSchema.parse(body);

    const updateData: any = {
      ...validatedData,
      ...(validatedData.dispositivoAsignadoId && {
        dispositivoAsignadoId: BigInt(validatedData.dispositivoAsignadoId)
      }),
      ...(validatedData.historialId !== undefined && {
        historialId: validatedData.historialId 
          ? BigInt(validatedData.historialId) 
          : null
      })
    };

    const grupoActualizado = await prisma.usuarioGrupo.update({
      where: { id: BigInt(id) },
      data: updateData
    });

    return NextResponse.json({
      ...grupoActualizado,
      id: grupoActualizado.id.toString(),
      dispositivoAsignadoId: grupoActualizado.dispositivoAsignadoId.toString(),
      historialId: grupoActualizado.historialId?.toString() || null
    });
  } catch (error) {
    console.error("Error en PUT:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar el grupo" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar grupo
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    if (!/^\d+$/.test(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const grupoEliminado = await prisma.usuarioGrupo.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json({
      ...grupoEliminado,
      id: grupoEliminado.id.toString(),
      dispositivoAsignadoId: grupoEliminado.dispositivoAsignadoId.toString(),
      historialId: grupoEliminado.historialId?.toString() || null
    });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { error: "Grupo no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar el grupo" },
      { status: 500 }
    );
  }
}