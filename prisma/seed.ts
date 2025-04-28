// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insertar PlanDisponible
  await prisma.planDisponible.create({
    data: {
      nombre: 'gratis',
      duracion: 0,
      descripcion: 'Plan básico de prueba con funciones limitadas',
      costo: 0,
    },
  });

  // Insertar ListaTarifa
  await prisma.listaTarifa.createMany({
    data: ['1', '1A', '1B', '1C', '1D', '1E', '1F','Sin tarifa'].map((tarifa) => ({
      tarifa,
    })),
  });

  // Insertar RolPermiso
  const permisos = await Promise.all([
    'gestionar_usuarios',
    'ver_analiticas_avanzadas',
    'exportar_datos',
    'ver_dashboard',
    'gestionar_dispositivos',
    'ver_historial',
    'configurar_sistema',
    'acceso_api',
  ].map(permiso => prisma.rolPermiso.create({ data: { permiso } })));

  // Insertar UsuarioRol con sus permisos
  await prisma.usuarioRol.create({
    data: {
      rol: 'admin',
      permisos: {
        connect: [
          { id: permisos[0].id }, // gestionar_usuarios
          { id: permisos[6].id }, // configurar_sistema
          { id: permisos[7].id }, // acceso_api
        ]
      }
    }
  });

  await prisma.usuarioRol.create({
    data: {
      rol: 'usuario_normal',
      permisos: {
        connect: [
          { id: permisos[3].id }, // ver_dashboard
          { id: permisos[4].id }, // gestionar_dispositivos
          { id: permisos[5].id }, // ver_historial
        ]
      }
    }
  });

  await prisma.usuarioRol.create({
    data: {
      rol: 'usuario_premium',
      permisos: {
        connect: [
          { id: permisos[1].id }, // ver_analiticas_avanzadas
          { id: permisos[2].id }, // exportar_datos
          { id: permisos[3].id }, // ver_dashboard
          { id: permisos[4].id }, // gestionar_dispositivos
          { id: permisos[5].id }, // ver_historial
          { id: permisos[7].id }, // acceso_api
        ]
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });