// src/app/api/pruebaw/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const pruebaSchema = z.object({
  voltaje: z.string().regex(/^\d+$/, "Debe ser un número entero válido"),
  corriente: z.string().regex(/^\d+$/, "Debe ser un número entero válido"),
  potencia: z.string().regex(/^\d+$/, "Debe ser un número entero válido"),
  energia: z.string().regex(/^\d+$/, "Debe ser un número entero válido"),
});

// GET todos los registros
export async function GET() {
  try {
    const registros = await prisma.prueba_w.findMany();
    
    return NextResponse.json(
      registros.map(registro => ({
        ...registro,
        id: registro.id.toString(),
        voltaje: registro.voltaje.toString(),
        corriente: registro.corriente.toString(),
        potencia: registro.potencia.toString(),
        energia: registro.energia.toString(),
      }))
    );

  } catch (error) {
    console.error("Error GET prueba_w:", error);
    return NextResponse.json(
      { error: "Error al obtener registros de prueba_w" },
      { status: 500 }
    );
  }
}

// POST nuevo registro
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = pruebaSchema.parse(body);
    
    const nuevoRegistro = await prisma.prueba_w.create({
      data: {
        voltaje: BigInt(validatedData.voltaje),
        corriente: BigInt(validatedData.corriente),
        potencia: BigInt(validatedData.potencia),
        energia: BigInt(validatedData.energia),
      }
    });

    return NextResponse.json(
      {
        ...nuevoRegistro,
        id: nuevoRegistro.id.toString(),
        voltaje: nuevoRegistro.voltaje.toString(),
        corriente: nuevoRegistro.corriente.toString(),
        potencia: nuevoRegistro.potencia.toString(),
        energia: nuevoRegistro.energia.toString(),
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error POST prueba_w:", error);
    
    return error instanceof z.ZodError 
      ? NextResponse.json({ error: error.errors[0].message }, { status: 400 })
      : NextResponse.json({ error: "Error al crear registro" }, { status: 500 });
  }
}