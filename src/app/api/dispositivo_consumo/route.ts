import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const dispositivoConsumoSchema = z.object({
  medicion: z.coerce.string()
    .regex(/^\d+$/, "La medición debe ser un número entero positivo")
    .transform(BigInt),
  tiempoConexion: z.coerce.string()
    .regex(/^\d+$/, "El tiempo de conexión debe ser un número entero positivo")
    .transform(BigInt)
});

// POST - Crear nuevo dispositivo de consumo
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = dispositivoConsumoSchema.parse(body);

    const nuevoDispositivo = await prisma.dispositivoConsumo.create({
      data: validatedData
    });

    // Convertir BigInts a strings para la respuesta
    const responseData = {
      ...nuevoDispositivo,
      id: nuevoDispositivo.id.toString(),
      medicion: nuevoDispositivo.medicion.toString(),
      tiempoConexion: nuevoDispositivo.tiempoConexion.toString()
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET - Obtener todos los dispositivos de consumo
export async function GET() {
  try {
    const dispositivos = await prisma.dispositivoConsumo.findMany();

    // Convertir BigInts a strings en cada registro
    const dispositivosConvertidos = dispositivos.map((dispositivo) => ({
      ...dispositivo,
      id: dispositivo.id.toString(),
      medicion: dispositivo.medicion.toString(),
      tiempoConexion: dispositivo.tiempoConexion.toString()
    }));

    return NextResponse.json(dispositivosConvertidos);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}