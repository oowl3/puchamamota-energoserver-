// src/app/api/usuario-grupo/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación para actualizaciones
const updateUsuarioGrupoSchema = z.object({
  nombre: z.string().min(1, "El nombre del grupo es obligatorio").optional(),
  historialId: z.string()
    .regex(/^\d+$/, "ID de historial inválido")
    .transform(val => BigInt(val))
    .optional()
    .nullable(),
  usuarioId: z.string()
    .regex(/^\d+$/, "ID de usuario inválido")
    .transform(val => BigInt(val))
    .optional(),
  dispositivos: z.array(z.string().regex(/^\d+$/)).optional()
});

// GET: Obtener grupo por ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del grupo" },
        { status: 400 }
      );
    }

    const grupo = await prisma.usuarioGrupo.findUnique({
      where: { id: BigInt(id) },
      include: {
        historial: true,
        usuario: true,
        dispositivos: true
      }
    });

    if (!grupo) {
      return NextResponse.json(
        { error: "Grupo no encontrado" },
        { status: 404 }
      );
    }

    // Convertir BigInt a string
    const grupoConvertido = {
      ...grupo,
      id: grupo.id.toString(),
      historialId: grupo.historialId?.toString() ?? null,
      usuarioId: grupo.usuarioId.toString(),
      dispositivos: grupo.dispositivos.map(d => ({
        ...d,
        id: d.id.toString(),
        grupoId: d.grupoId?.toString() ?? null
      }))
    };

    return NextResponse.json(grupoConvertido);
  } catch (error) {
    console.error("Error GET grupo:", error);
    return NextResponse.json(
      { error: "Error al obtener el grupo" },
      { status: 500 }
    );
  }
}

// PUT: Actualizar grupo
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del grupo" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateUsuarioGrupoSchema.parse(body);

    const grupoActualizado = await prisma.usuarioGrupo.update({
      where: { id: BigInt(id) },
      data: {
        nombre: validatedData.nombre,
        historialId: validatedData.historialId,
        usuarioId: validatedData.usuarioId,
        dispositivos: validatedData.dispositivos ? {
          set: validatedData.dispositivos.map(id => ({ id: BigInt(id) }))
        } : undefined
      },
      include: {
        dispositivos: true
      }
    });

    // Convertir BigInt a string
    const responseData = {
      ...grupoActualizado,
      id: grupoActualizado.id.toString(),
      historialId: grupoActualizado.historialId?.toString() ?? null,
      usuarioId: grupoActualizado.usuarioId.toString(),
      dispositivos: grupoActualizado.dispositivos.map(d => ({
        ...d,
        id: d.id.toString(),
        grupoId: d.grupoId?.toString() ?? null
      }))
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error PUT grupo:", error);
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al actualizar el grupo" }, { status: 500 });
  }
}

// DELETE: Eliminar grupo
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Se requiere el ID del grupo" },
        { status: 400 }
      );
    }

    await prisma.usuarioGrupo.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json(
      { success: "Grupo eliminado correctamente" }
    );
  } catch (error) {
    console.error("Error DELETE grupo:", error);
    return NextResponse.json(
      { error: "Error al eliminar el grupo" },
      { status: 500 }
    );
  }
}