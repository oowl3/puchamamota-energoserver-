import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema para actualización
const updateUsuarioSchema = z.object({
  nombre: z.string().min(1).optional(),
  apellido: z.string().min(1).optional(),
  edad: z.string().regex(/^\d+$/).transform(v => BigInt(v)).optional(),
  genero: z.string().min(1).optional(),
  telefono: z.string().regex(/^\d+$/).transform(v => BigInt(v)).optional().nullable(),
  tokenId: z.string().regex(/^\d+$/).transform(v => BigInt(v)).optional().nullable(),
  configuracionId: z.string().regex(/^\d+$/).transform(v => BigInt(v)).optional().nullable(),
  rolId: z.string().regex(/^\d+$/).transform(v => BigInt(v)).optional().nullable()
});

// GET - Obtener usuario por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const usuarioId = params.id;
    
    if (!/^\d+$/.test(usuarioId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: BigInt(usuarioId) },
      include: {
        grupos: {
          include: {
            dispositivos: true
          }
        }
      }
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Conversión de BigInt a strings
    const usuarioConvertido = {
      ...usuario,
      id: usuario.id.toString(),
      edad: usuario.edad.toString(),
      telefono: usuario.telefono?.toString(),
      tokenId: usuario.tokenId?.toString(),
      configuracionId: usuario.configuracionId?.toString(),
      rolId: usuario.rolId?.toString(),
      grupos: usuario.grupos.map(grupo => ({
        ...grupo,
        id: grupo.id.toString(),
        historialId: grupo.historialId?.toString(),
        dispositivos: grupo.dispositivos.map(dispositivo => ({
          ...dispositivo,
          id: dispositivo.id.toString(),
          ubicacionId: dispositivo.ubicacionId.toString(),
          grupoId: dispositivo.grupoId?.toString()
        }))
      }))
    };

    return NextResponse.json(usuarioConvertido);
  } catch (error) {
    console.error("Error en GET por ID:", error);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar usuario
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const usuarioId = params.id;
    
    if (!/^\d+$/.test(usuarioId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateUsuarioSchema.parse(body);

    const updateData: any = {};
    
    // Construir datos de actualización
    Object.keys(validatedData).forEach(key => {
      if (validatedData[key] !== undefined) {
        updateData[key] = validatedData[key];
      }
    });

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: BigInt(usuarioId) },
      data: updateData
    });

    // Convertir BigInt a strings
    const responseData = {
      ...usuarioActualizado,
      id: usuarioActualizado.id.toString(),
      edad: usuarioActualizado.edad.toString(),
      telefono: usuarioActualizado.telefono?.toString(),
      tokenId: usuarioActualizado.tokenId?.toString(),
      configuracionId: usuarioActualizado.configuracionId?.toString(),
      rolId: usuarioActualizado.rolId?.toString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error en PUT:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map(e => e.message) },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al actualizar el usuario" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const usuarioId = params.id;
    
    if (!/^\d+$/.test(usuarioId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    // Verificar existencia primero
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: BigInt(usuarioId) }
    });

    if (!usuarioExistente) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const usuarioEliminado = await prisma.usuario.delete({
      where: { id: BigInt(usuarioId) }
    });

    return NextResponse.json({
      ...usuarioEliminado,
      id: usuarioEliminado.id.toString(),
      edad: usuarioEliminado.edad.toString()
    });
  } catch (error) {
    console.error("Error en DELETE:", error);
    
    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al eliminar el usuario" },
      { status: 500 }
    );
  }
}