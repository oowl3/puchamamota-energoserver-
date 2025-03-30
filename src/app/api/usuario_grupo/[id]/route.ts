// src/app/api/usuario_grupo/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquemas de validación
const idParamSchema = z.object({
  id: z.coerce.number().positive("ID debe ser un número positivo")
});

const updateGrupoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  usuarioId: z.coerce.number().positive("ID de usuario inválido"),
  historialId: z.coerce.number().positive("ID de historial inválido").nullable().optional(),
  dispositivosIds: z.array(z.coerce.number().positive()).optional()
});

// GET: Obtener grupo por ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const { id } = idParamSchema.parse({ id: idString });

    const grupo = await prisma.usuarioGrupo.findUnique({
      where: { id: BigInt(id) },
      include: {
        usuario: true,
        historial: true,
        dispositivos: true
      }
    });

    if (!grupo) {
      return NextResponse.json(
        { error: "Grupo no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...grupo,
      id: grupo.id.toString(),
      usuarioId: grupo.usuarioId.toString(),
      historialId: grupo.historialId?.toString() || null,
      usuario: {
        ...grupo.usuario,
        id: grupo.usuario.id.toString()
      },
      historial: grupo.historial ? {
        ...grupo.historial,
        id: grupo.historial.id.toString()
      } : null,
      dispositivos: grupo.dispositivos.map(d => ({
        ...d,
        id: d.id.toString(),
        grupoId: d.grupoId?.toString()
      }))
    });

  } catch (error) {
    console.error("Error GET grupo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al obtener el grupo" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar grupo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const { id } = idParamSchema.parse({ id: idString });
    
    const body = await request.json();
    const validatedData = updateGrupoSchema.parse(body);

    const grupoActualizado = await prisma.usuarioGrupo.update({
      where: { id: BigInt(id) },
      data: {
        nombre: validatedData.nombre,
        usuario: {
          connect: { id: BigInt(validatedData.usuarioId) }
        },
        historial: validatedData.historialId ? {
          connect: { id: BigInt(validatedData.historialId) }
        } : { disconnect: true },
        dispositivos: validatedData.dispositivosIds ? {
          set: validatedData.dispositivosIds.map(id => ({
            id: BigInt(id)
          }))
        } : undefined
      },
      include: {
        usuario: true,
        historial: true,
        dispositivos: true
      }
    });

    return NextResponse.json({
      ...grupoActualizado,
      id: grupoActualizado.id.toString(),
      usuarioId: grupoActualizado.usuarioId.toString(),
      historialId: grupoActualizado.historialId?.toString() || null,
      usuario: {
        ...grupoActualizado.usuario,
        id: grupoActualizado.usuario.id.toString()
      },
      historial: grupoActualizado.historial ? {
        ...grupoActualizado.historial,
        id: grupoActualizado.historial.id.toString()
      } : null,
      dispositivos: grupoActualizado.dispositivos.map(d => ({
        ...d,
        id: d.id.toString(),
        grupoId: d.grupoId?.toString()
      }))
    });

  } catch (error) {
    console.error("Error PUT grupo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes("P2025")) {
      return NextResponse.json(
        { error: "Recurso relacionado no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar el grupo" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar grupo
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const { id } = idParamSchema.parse({ id: idString });

    await prisma.usuarioGrupo.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json(
      { message: "Grupo eliminado correctamente" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error DELETE grupo:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message.includes("P2025")) {
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