import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Esquema de validación
const usuarioConfigSchema = z.object({
  foto: z.string().optional().nullable(),
  idiomaId: z.string().regex(/^\d+$/, "ID de idioma inválido"),
  periodoFacturacion: z.string().regex(/^\d+$/, "Período inválido"),
  consumoInicial: z.string().regex(/^\d+$/, "Consumo inicial inválido"),
  consumoAnterior: z.string().regex(/^\d+$/, "Consumo anterior inválido"),
  consumoActual: z.string().regex(/^\d+$/, "Consumo actual inválido"),
  tarifaId: z.string().regex(/^\d+$/, "ID de tarifa inválido"),
  metodoPago: z.string().min(2, "Método de pago inválido"),
  planActualId: z.string().regex(/^\d+$/, "ID de plan inválido")
});

// Tipo para la respuesta
type UsuarioConfigResponse = {
  id: string;
  foto?: string | null;
  idiomaId: string;
  periodoFacturacion: string;
  consumoInicial: string;
  consumoAnterior: string;
  consumoActual: string;
  tarifaId: string;
  metodoPago: string;
  planActualId: string;
};

// POST - Crear nueva configuración
export async function POST(request: Request): Promise<NextResponse<UsuarioConfigResponse | { error: string; detalles?: z.ZodIssue[] }>> {
  try {
    const body: unknown = await request.json();
    const validatedData = usuarioConfigSchema.parse(body);

    // Convertir strings a BigInt (mantenemos el null para foto)
    const data = {
      ...validatedData,
      idiomaId: BigInt(validatedData.idiomaId),
      periodoFacturacion: BigInt(validatedData.periodoFacturacion),
      consumoInicial: BigInt(validatedData.consumoInicial),
      consumoAnterior: BigInt(validatedData.consumoAnterior),
      consumoActual: BigInt(validatedData.consumoActual),
      tarifaId: BigInt(validatedData.tarifaId),
      planActualId: BigInt(validatedData.planActualId)
    };

    const nuevaConfig = await prisma.usuarioConfiguracion.create({ data });

    // Convertir BigInt a strings y manejar null en foto
    const responseData: UsuarioConfigResponse = {
      ...nuevaConfig,
      id: nuevaConfig.id.toString(),
      foto: nuevaConfig.foto ?? null,
      idiomaId: nuevaConfig.idiomaId.toString(),
      periodoFacturacion: nuevaConfig.periodoFacturacion.toString(),
      consumoInicial: nuevaConfig.consumoInicial.toString(),
      consumoAnterior: nuevaConfig.consumoAnterior.toString(),
      consumoActual: nuevaConfig.consumoActual.toString(),
      tarifaId: nuevaConfig.tarifaId.toString(),
      metodoPago: nuevaConfig.metodoPago,
      planActualId: nuevaConfig.planActualId.toString()
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error en POST:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Error al crear configuración" },
      { status: 500 }
    );
  }
}

// GET - Obtener todas las configuraciones
export async function GET(): Promise<NextResponse<UsuarioConfigResponse[] | { error: string }>> {
  try {
    const configuraciones = await prisma.usuarioConfiguracion.findMany();

    // Convertir y manejar null en foto
    const configsConvertidas: UsuarioConfigResponse[] = configuraciones.map((config) => ({
      ...config,
      id: config.id.toString(),
      foto: config.foto ?? null,
      idiomaId: config.idiomaId.toString(),
      periodoFacturacion: config.periodoFacturacion.toString(),
      consumoInicial: config.consumoInicial.toString(),
      consumoAnterior: config.consumoAnterior.toString(),
      consumoActual: config.consumoActual.toString(),
      tarifaId: config.tarifaId.toString(),
      metodoPago: config.metodoPago,
      planActualId: config.planActualId.toString()
    }));

    return NextResponse.json(configsConvertidas);
  } catch (error) {
    console.error("Error en GET:", error);
    return NextResponse.json(
      { error: "Error al obtener configuraciones" },
      { status: 500 }
    );
  }
}