import { PrismaClient } from '@prisma/client';

// 1. Tipo del cliente extendido
type ExtendedPrismaClient = ReturnType<typeof getExtendedPrismaClient>;

// 2. Función para extender el cliente
function getExtendedPrismaClient() {
  return new PrismaClient().$extends({
    query: {
      async $allOperations({ args, query }) {  // <-- Quitamos variables no usadas
        const result = await query(args);
        return convertBigIntToString(result);
      },
    },
  });
}

// 3. Función recursiva para BigInt (sin 'any')
function convertBigIntToString(obj: unknown): unknown {
  if (typeof obj === 'bigint') {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};
    for (const key in obj) {
      const value = (obj as Record<string, unknown>)[key];
      newObj[key] = convertBigIntToString(value);
    }
    return newObj;
  }
  return obj;
}

// 4. Instancia del cliente
const prisma: ExtendedPrismaClient = getExtendedPrismaClient();

// 5. Declaración global
declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

// Configuración para desarrollo
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;