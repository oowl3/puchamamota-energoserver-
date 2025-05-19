// src/app/api/prueba_w/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { NextRequest } from 'next/server';

const createSchema = z.object({
  codigo: z.string().min(1, "El código es requerido"),
  voltaje: z.string().regex(/^\d+\.?\d*$/, "Valor de voltaje inválido"),
  corriente: z.string().regex(/^\d+\.?\d*$/, "Valor de corriente inválido"),
  potencia: z.string().regex(/^\d+\.?\d*$/, "Valor de potencia inválido"),
  energia: z.string().regex(/^\d+\.?\d*$/, "Valor de energía inválido"),
});

// GET todos los registros
export async function GET(request: NextRequest) {
  try {
    const registros = await prisma.prueba_w.findMany();
    
    return NextResponse.json(
      registros.map(r => ({
        ...r,
        id: r.id.toString(),
        voltaje: r.voltaje.toString(),
        corriente: r.corriente.toString(),
        potencia: r.potencia.toString(),
        energia: r.energia.toString()
      }))
    );
    
  } catch (error) {
    console.error("Error GET prueba_w:", error);
    return NextResponse.json(
      { error: "Error al obtener registros" },
      { status: 500 }
    );
  }
}

// POST nuevo registro
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSchema.parse(body);
    
    // Verificar código único
    const existente = await prisma.prueba_w.findFirst({
      where: { codigo: validatedData.codigo }
    });
    
    if (existente) {
      return NextResponse.json(
        { error: "El código ya está registrado" },
        { status: 400 }
      );
    }
    
    const nuevoRegistro = await prisma.prueba_w.create({
      data: {
        codigo: validatedData.codigo,
        voltaje: validatedData.voltaje,
        corriente: validatedData.corriente,
        potencia: validatedData.potencia,
        energia: validatedData.energia
      }
    });

    return NextResponse.json(
      {
        ...nuevoRegistro,
        id: nuevoRegistro.id.toString(),
        voltaje: nuevoRegistro.voltaje.toString(),
        corriente: nuevoRegistro.corriente.toString(),
        potencia: nuevoRegistro.potencia.toString(),
        energia: nuevoRegistro.energia.toString()
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