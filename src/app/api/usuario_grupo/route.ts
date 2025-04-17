import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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