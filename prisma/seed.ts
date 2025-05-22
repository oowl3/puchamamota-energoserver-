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
    data: ['1', '1A', '1B', '1C', '1D', '1E', '1F', 'Sin tarifa'].map((tarifa) => ({
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

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  // Insertar Información de FAQ
  await prisma.informacion.createMany({
    data: [
      {pregunta: "✨¿Cómo creo una cuenta en la plataforma?",
        respuesta: "Regístrate en menos de un minuto con tu correo electrónico y una contraseña. Una vez dentro, agrega tus sensores y empieza a optimizar tu consumo de energía. ¡Crea tu cuenta ahora!",
      },
      {
        pregunta: "⚡¿Cómo se instala el sensor?",
        respuesta: "La instalación es sencilla: solo debes conectar el sensor entre el enchufe y el dispositivo que deseas monitorear. Luego, sigue las instrucciones en la plataforma para vincularlo a tu cuenta.",
      },
      {
        pregunta: "🕛¿Cada cuánto tiempo se actualizan los datos de consumo?",
        respuesta: "Los datos se actualizan en tiempo real o con una pequeña demora de segundos dependiendo de la conexión a internet.",
      },
      {
        pregunta: "🤔¿Puedo conectar más de un sensor a la misma cuenta?",
        respuesta: "Sí, puedes conectar varios sensores a tu cuenta sin problemas. Solo añádelos desde la plataforma siguiendo unos simples pasos, y empezarás a monitorear todos tus dispositivos en un solo lugar.",
      },
      {
        pregunta: "💡¿Puedo establecer alertas de consumo alto?",
        respuesta: "Sí, la plataforma permite configurar alertas personalizadas. Puedes recibir notificaciones cuando el consumo de un dispositivo supere un límite determinado, lo que te ayudará a controlar tu consumo eléctrico.",
      },
      {
        pregunta: "💸¿Puedo ver un historial de mi consumo energético?",
        respuesta: "Sí, la plataforma te permite visualizar un historial detallado del consumo energético de tus dispositivos. Puedes ver estadísticas por día, semana, mes o año para optimizar tu uso de energía.",
      },
      {
        pregunta: "🔋¿Cuánto tiempo dura la batería del sensor?",
        respuesta: "Los sensores están diseñados para durar largos períodos de tiempo con baterías eficientes. Sin embargo, la duración puede variar dependiendo del uso y la conectividad. La plataforma te notificará cuando sea necesario cambiar la batería.",
      },
      {
        pregunta: "🔒¿La plataforma es segura?",
        respuesta: "Sí, la plataforma emplea medidas de seguridad avanzadas para proteger tus datos. Usamos cifrado para mantener tu información a salvo y cumplir con las mejores prácticas de privacidad.",
      },
      {
        pregunta: "📖¿Qué datos almacena la plataforma sobre su consumo?",
        respuesta: "Tu privacidad es nuestra prioridad. Solo registramos los datos esenciales sobre el consumo de energía de tus dispositivos para ofrecerte un mejor análisis. No compartimos ni vendemos tu información a terceros.",
      },
      {
        pregunta: "📊¿Puedo generar reportes de mi consumo energético?",
        respuesta: "Sí, puedes generar reportes detallados sobre tu consumo energético. Estos reportes pueden ser útiles para analizar tus hábitos y mejorar la eficiencia energética en tu hogar o negocio.",
      },
      {
        pregunta: "⚙️¿Qué dispositivos son compatibles con la plataforma?",
        respuesta: "La plataforma es compatible con una amplia variedad de sensores de consumo eléctrico y dispositivos inteligentes. Consulta la lista de dispositivos compatibles en la sección de ayuda para saber más.",
      },
      {
        pregunta: "🛑¿Qué hago si mi sensor no se conecta?",
        respuesta: "Si tienes problemas para conectar el sensor, asegúrate de que esté correctamente conectado y que tu red Wi-Fi esté funcionando. Si el problema persiste, consulta la sección de soporte técnico o contacta con nuestro equipo de ayuda.",
      },
      {
        pregunta: "🛠️¿Es difícil de instalar o configurar?",
        respuesta: "La instalación y configuración son extremadamente simples. Solo necesitas conectar el sensor al dispositivo que deseas monitorear y seguir las instrucciones en la plataforma para sincronizarlo con tu cuenta. ¡Es rápido y fácil!",
      },

    ],
  });


  // Creación del usuario principal
  const usuario = await prisma.usuario.create({
    data: {
      email: '222310024@itslerdo.edu.mx',
      nombre: 'Josue',
      apellido: 'Ojeda',
      edad: 20,
      genero: 'H',
      telefono: '8717961885',
      tarifaId: 1,
      rolId: 1,
    },
  });


  // Configuración del usuario
  const usuarioConfig = await prisma.usuarioConfiguracion.create({
    data: {
      periodoFacturacion: 'mensual',
      consumoAnterior: 100,
      consumoActual: 150,
      planActualId: 1,
      usuarios: {
        connect: { id: usuario.id }
      }
    }
  });

  // Configuración de alertas
  await prisma.configuracionAlerta.create({
    data: {
      nombre: 'Alerta Consumo Alto',
      tiempo: 24,
      consumo: 200,
      usuarioConfiguracionId: usuarioConfig.id,
    }
  });

  // Grupo Historial
  const grupoHistorial = await prisma.grupoHistorial.create({
    data: {
      periodo: 30,
      fechaCorte: new Date('2024-12-31'),
      consumo: 500
    }
  });

  // Grupo de usuario
  const usuarioGrupo = await prisma.usuarioGrupo.create({
    data: {
      nombre: 'Hogar Principal',
      usuarioId: usuario.id,
      historialId: grupoHistorial.id
    }
  });

  // Dispositivo con consumos
  const dispositivo = await prisma.dispositivo.create({
    data: {
      codigoesp: 'ESP32-001',
      nombreDispositivo: 'Refrigerador Inteligente',
      consumoAparatoSug: 150,
      ubicacion: "cocina",
      grupoId: usuarioGrupo.id,
      consumos: {
        create: [
          {
            voltaje: 120.5,
            corriente: 2.1,
            potencia: 253.05,
            energia: 1.2,
            fechaHora: new Date()
          },
          {
            voltaje: 121.0,
            corriente: 2.0,
            potencia: 242.0,
            energia: 1.5,
            fechaHora: new Date(new Date().setHours(new Date().getHours() - 2))
          }
        ]
      }
    },
    include: {
      consumos: true
    }
  });

  await prisma.prueba_w.createMany({
    data: [
      {
        codigo: 'U-1-001',
        voltaje: 127.0,
        corriente: 3.2,
        potencia: 406.4,
        energia: 1.1
      },
      {
        codigo: 'U-1-002',
        voltaje: 220.0,
        corriente: 6.1,
        potencia: 1342.0,
        energia: 2.9
      },
      {
        codigo: 'U-1-003',
        voltaje: 127.0,
        corriente: 4.5,
        potencia: 571.5,
        energia: 1.6
      },
      {
        codigo: 'U-1-004',
        voltaje: 127.0,
        corriente: 2.1,
        potencia: 266.7,
        energia: 0.9
      },
      {
        codigo: 'U-1-005',
        voltaje: 220.0,
        corriente: 8.0,
        potencia: 1760.0,
        energia: 3.7
      },
      {
        codigo: 'U-1-006',
        voltaje: 127.0,
        corriente: 1.7,
        potencia: 215.9,
        energia: 0.6
      },
      {
        codigo: 'U-1-007',
        voltaje: 220.0,
        corriente: 4.3,
        potencia: 946.0,
        energia: 2.1
      },
      {
        codigo: 'U-1-008',
        voltaje: 127.0,
        corriente: 6.2,
        potencia: 787.4,
        energia: 2.4
      },
      {
        codigo: 'U-1-009',
        voltaje: 220.0,
        corriente: 5.0,
        potencia: 1100.0,
        energia: 2.0
      },
      {
        codigo: 'U-1-010',
        voltaje: 127.0,
        corriente: 3.8,
        potencia: 482.6,
        energia: 1.3
      }
    ]
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