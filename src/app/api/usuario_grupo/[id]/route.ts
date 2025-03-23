import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const idSchema = z.string().regex(/^\d+$/).transform(v => BigInt(v));

const grupoUpdateSchema = grupoSchema.partial();

// GET - Obtener grupo por ID
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await idSchema.parseAsync(params.id);

    const grupo = await prisma.usuarioGrupo.findUnique({
      where: { id },
      include: {
        listaLugar: true,
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

    const grupoConvertido = {
      ...grupo,
      id: grupo.id.toString(),
      lugarId: grupo.lugarId.toString(),
      dispositivoAsignadoId: grupo.dispositivoAsignadoId.toString(),
      historialId: grupo.historialId?.toString(),
      listaLugar: {
        ...grupo.listaLugar,
        id: grupo.listaLugar.id.toString()
      },
      dispositivo: {
        ...grupo.dispositivo,
        id: grupo.dispositivo.id.toString()
      },
      ...(grupo.historial && {
        historial: {
          ...grupo.historial,
          id: grupo.historial.id.toString()
        }
      }),
      usuarios: grupo.usuarios.map(usuario => ({
        ...usuario,
        id: usuario.id.toString()
      }))
    };

    return NextResponse.json(grupoConvertido);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    console.error("Error en GET:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// PUT - Actualizar grupo
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const [id, body] = await Promise.all([
      idSchema.parseAsync(params.id),
      request.json()
    ]);
    
    const validatedData = await grupoUpdateSchema.parseAsync(body);

    const grupoActualizado = await prisma.usuarioGrupo.update({
      where: { id },
      data: {
        ...validatedData,
        ...(validatedData.lugarId && { listaLugar: { connect: { id: validatedData.lugarId } } }),
        ...(validatedData.dispositivoAsignadoId && { dispositivo: { connect: { id: validatedData.dispositivoAsignadoId } } }),
        ...(validatedData.historialId && { historial: { connect: { id: validatedData.historialId } } })
      },
      include: {
        listaLugar: true,
        dispositivo: true,
        historial: true
      }
    });

    const responseData = {
      ...grupoActualizado,
      id: grupoActualizado.id.toString(),
      lugarId: grupoActualizado.lugarId.toString(),
      dispositivoAsignadoId: grupoActualizado.dispositivoAsignadoId.toString(),
      historialId: grupoActualizado.historialId?.toString(),
      listaLugar: {
        ...grupoActualizado.listaLugar,
        id: grupoActualizado.listaLugar.id.toString()
      },
      dispositivo: {
        ...grupoActualizado.dispositivo,
        id: grupoActualizado.dispositivo.id.toString()
      },
      ...(grupoActualizado.historial && {
        historial: {
          ...grupoActualizado.historial,
          id: grupoActualizado.historial.id.toString()
        }
      })
    };

    return NextResponse.json(responseData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("registro solicitado")) {
      return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });
    }
    console.error("Error en PUT:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// DELETE - Eliminar grupo
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await idSchema.parseAsync(params.id);

    await prisma.usuarioGrupo.delete({
      where: { id }
    });

    return NextResponse.json(
      { mensaje: "Grupo eliminado correctamente" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    if (error instanceof Error && error.message.includes("registro solicitado")) {
      return NextResponse.json({ error: "Grupo no encontrado" }, { status: 404 });
    }
    console.error("Error en DELETE:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}