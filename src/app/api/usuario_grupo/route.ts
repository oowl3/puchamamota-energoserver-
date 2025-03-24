import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación actualizado
const grupoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  dispositivoAsignadoId: z.coerce.string() // Añadido coerce para convertir números a string
    .min(1, "Se requiere ID de dispositivo")
    .regex(/^\d+$/, "Debe ser un número entero positivo"),
  historialId: z.coerce.string() // Añadido coerce para conversión automática
    .regex(/^\d+$/, "Debe ser un número entero positivo")
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val) // Manejar strings vacíos
});

// POST - Crear nuevo grupo (versión corregida)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = grupoSchema.parse(body);

    const nuevoGrupo = await prisma.usuarioGrupo.create({
      data: {
        nombre: validatedData.nombre,
        dispositivoAsignadoId: BigInt(validatedData.dispositivoAsignadoId),
        historialId: validatedData.historialId 
          ? BigInt(validatedData.historialId) 
          : null
      }
    });

    return NextResponse.json({
      ...nuevoGrupo,
      id: nuevoGrupo.id.toString(),
      dispositivoAsignadoId: nuevoGrupo.dispositivoAsignadoId.toString(),
      historialId: nuevoGrupo.historialId?.toString() || null
    }, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: error instanceof z.ZodError 
        ? error.errors.map(e => e.message) 
        : "Error al crear el grupo" },
      { status: 500 }
    );
  }
}

// GET - Versión mejorada con manejo de relaciones
export async function GET() {
  try {
    const grupos = await prisma.usuarioGrupo.findMany({
      include: {
        dispositivo: true,
        historial: true,
        usuarios: true
      }
    });

    const gruposConvertidos = grupos.map(grupo => ({
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