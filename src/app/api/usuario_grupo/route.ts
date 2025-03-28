// src/app/api/usuario_grupo/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const grupoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  usuarioId: z.coerce.string()
    .regex(/^\d+$/, "ID de usuario inválido"),
  historialId: z.coerce.string()
    .regex(/^\d+$/, "ID de historial inválido")
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val),
  dispositivosIds: z.array(z.string().regex(/^\d+$/)).optional()
});

// POST - Crear nuevo grupo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = grupoSchema.parse(body);

    const nuevoGrupo = await prisma.usuarioGrupo.create({
      data: {
        nombre: validatedData.nombre,
        usuario: {
          connect: { id: BigInt(validatedData.usuarioId) }
        },
        historial: validatedData.historialId ? {
          connect: { id: BigInt(validatedData.historialId) }
        } : undefined,
        dispositivos: validatedData.dispositivosIds ? {
          connect: validatedData.dispositivosIds.map(id => ({
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
      ...nuevoGrupo,
      id: nuevoGrupo.id.toString(),
      usuarioId: nuevoGrupo.usuarioId.toString(),
      historialId: nuevoGrupo.historialId?.toString() || null,
      usuario: {
        ...nuevoGrupo.usuario,
        id: nuevoGrupo.usuario.id.toString()
      },
      historial: nuevoGrupo.historial ? {
        ...nuevoGrupo.historial,
        id: nuevoGrupo.historial.id.toString()
      } : null,
      dispositivos: nuevoGrupo.dispositivos.map(d => ({
        ...d,
        id: d.id.toString(),
        grupoId: d.grupoId?.toString()
      }))
    }, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: error instanceof z.ZodError 
        ? error.errors.map(e => e.message) 
        : "Error al crear el grupo" },
      { status: error instanceof z.ZodError ? 400 : 500 }
    );
  }
}

// GET - Obtener todos los grupos
export async function GET() {
  try {
    const grupos = await prisma.usuarioGrupo.findMany({
      include: {
        usuario: true,
        historial: true,
        dispositivos: true
      }
    });

    const gruposConvertidos = grupos.map(grupo => ({
      ...grupo,
      id: grupo.id.toString(),
      usuarioId: grupo.usuarioId.toString(),
      historialId: grupo.historialId?.toString() || null,
      usuario: {
        ...grupo.usuario,
        id: grupo.usuario.id.toString(),
        configuracionId: grupo.usuario.configuracionId?.toString(),
        rolId: grupo.usuario.rolId?.toString(),
        tokenId: grupo.usuario.tokenId?.toString()
      },
      historial: grupo.historial ? {
        ...grupo.historial,
        id: grupo.historial.id.toString()
      } : null,
      dispositivos: grupo.dispositivos.map(d => ({
        ...d,
        id: d.id.toString(),
        grupoId: d.grupoId?.toString(),
        ubicacionId: d.ubicacionId.toString()
      }))
    }));

    return NextResponse.json(gruposConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener los grupos" },
      { status: 500 }
    );
  }
}