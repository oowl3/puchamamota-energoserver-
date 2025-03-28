// src/app/api/usuario_grupo/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización
const updateGrupoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").optional(),
  usuarioId: z.coerce.string()
    .regex(/^\d+$/, "ID de usuario inválido")
    .optional(),
  historialId: z.coerce.string()
    .regex(/^\d+$/, "ID de historial inválido")
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  dispositivosIds: z.array(z.string().regex(/^\d+$/)).optional()
});

// Tipos para conversión segura
type GrupoEntity = {
  id: bigint;
  nombre?: string;
  usuarioId: bigint;
  historialId?: bigint | null;
  usuario?: UserEntity;
  historial?: HistorialEntity;
  dispositivos?: DispositivoEntity[];
};

type UserEntity = {
  id: bigint;
  nombre: string;
  apellido: string;
  edad: bigint;
  genero: string;
  telefono: bigint | null;
  tokenId: bigint | null;
  configuracionId: bigint | null;
  rolId: bigint | null;
};

type HistorialEntity = {
  id: bigint;
};

type DispositivoEntity = {
  id: bigint;
  grupoId?: bigint;
};

type ConvertibleEntity = GrupoEntity | UserEntity | HistorialEntity | DispositivoEntity;

// Función de conversión type-safe
function convertEntity<T extends ConvertibleEntity>(entity: T): 
  T extends GrupoEntity ? Omit<T, 'id' | 'usuarioId' | 'historialId'> & {
    id: string;
    usuarioId: string;
    historialId?: string | null;
  } :
  T extends (UserEntity | HistorialEntity | DispositivoEntity) ? Omit<T, 'id'> & {
    id: string;
  } :
  never {
  
  // Conversión base para todos los tipos
  const baseConverted = {
    ...entity,
    id: entity.id.toString()
  };

  // Conversión específica para GrupoEntity
  if ('usuarioId' in entity) {
    return {
      ...baseConverted,
      usuarioId: entity.usuarioId.toString(),
      historialId: entity.historialId?.toString() ?? null
    } as never;
  }

  return baseConverted as never;
}

// GET - Obtener grupo por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const grupo = await prisma.usuarioGrupo.findUnique({
      where: { id: BigInt(params.id) },
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

    // Conversión tipo-safe
    const convertedGrupo = convertEntity(grupo);
    const convertedUsuario = grupo.usuario ? convertEntity(grupo.usuario) : null;
    const convertedHistorial = grupo.historial ? convertEntity(grupo.historial) : null;
    const convertedDispositivos = grupo.dispositivos.map(convertEntity);

    return NextResponse.json({
      ...convertedGrupo,
      usuario: convertedUsuario,
      historial: convertedHistorial,
      dispositivos: convertedDispositivos
    });
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener el grupo" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar grupo
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const validatedData = updateGrupoSchema.parse(body);

    // Tipo para datos de actualización
    type UpdateData = {
      nombre?: string;
      usuario?: { connect: { id: bigint } };
      historial?: { connect: { id: bigint } } | { disconnect: true };
      dispositivos?: { set: Array<{ id: bigint }> };
    };

    const updateData: UpdateData = {
      nombre: validatedData.nombre
    };

    if (validatedData.usuarioId !== undefined) {
      updateData.usuario = { connect: { id: BigInt(validatedData.usuarioId) } };
    }

    if (validatedData.historialId !== undefined) {
      updateData.historial = validatedData.historialId
        ? { connect: { id: BigInt(validatedData.historialId) } } // Corregido
        : { disconnect: true };
    }

    if (validatedData.dispositivosIds !== undefined) {
      updateData.dispositivos = { 
        set: validatedData.dispositivosIds.map(id => ({ id: BigInt(id) })) 
      };
    }

    const grupoActualizado = await prisma.usuarioGrupo.update({
      where: { id: BigInt(params.id) },
      data: updateData,
      include: {
        usuario: true,
        historial: true,
        dispositivos: true
      }
    });

    return NextResponse.json({
      ...convertEntity(grupoActualizado),
      usuario: convertEntity(grupoActualizado.usuario),
      historial: grupoActualizado.historial ? convertEntity(grupoActualizado.historial) : null,
      dispositivos: grupoActualizado.dispositivos.map(convertEntity)
    });
  } catch (error) {
    console.error("Error en PUT:", error);
    return NextResponse.json(
      { error: error instanceof z.ZodError 
        ? error.errors.map(e => e.message) 
        : "Error al actualizar el grupo" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar grupo (sin cambios necesarios)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.$transaction([
      prisma.dispositivo.deleteMany({
        where: { grupoId: BigInt(params.id) }
      }),
      prisma.usuarioGrupo.delete({
        where: { id: BigInt(params.id) }
      })
    ]);

    return NextResponse.json({
      message: "Grupo eliminado correctamente",
      id: params.id
    });
  } catch (error) {
    console.error("Error en DELETE:", error);
    return NextResponse.json(
      { error: "Error al eliminar el grupo" },
      { status: 500 }
    );
  }
}