import React from 'react';
import Header_home from '@/app/components/elements/header/Header_home';

const faqList = [
  {
    question: '¿Cómo se instala el sensor?',
    answer:
      'La instalación es sencilla: solo debes conectar el sensor entre el enchufe y el dispositivo que deseas monitorear. Luego, sigue las instrucciones en la plataforma para vincularlo a tu cuenta.',
  },
  {
    question: '¿Cada cuánto tiempo se actualizan los datos de consumo?',
    answer:
      'Los datos se actualizan en tiempo real o con una pequeña demora de segundos dependiendo de la conexión a internet.',
  },
  {
    question: '¿Puedo conectar más de un sensor a la misma cuenta?',
    answer:
      'Sí, puedes conectar varios sensores a tu cuenta sin problemas. Solo añádelos desde la plataforma siguiendo unos simples pasos, y empezarás a monitorear todos tus dispositivos en un solo lugar.',
  },
  {
    question: '¿Qué datos almacena la plataforma sobre su consumo?',
    answer:
      'Tu privacidad es nuestra prioridad. Solo registramos los datos esenciales sobre el consumo de energía de tus dispositivos para ofrecerte un mejor análisis. No compartimos ni vendemos tu información a terceros.',
  },
  {
    question: '¿Cómo creo una cuenta en la plataforma?',
    answer:
      'Regístrate en menos de un minuto con tu correo electrónico y una contraseña. Una vez dentro, agrega tus sensores y empieza a optimizar tu consumo de energía. ¡Crea tu cuenta ahora!',
  },
];

const Questions = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header_home />
      <h2 className="text-3xl font-bold mt-6 mb-4 text-center">Preguntas Frecuentes</h2>
      <hr className="mb-6 border-gray-300" />

      <ul className="space-y-6">
        {faqList.map((faq, index) => (
          <li key={index}>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">{faq.question}</h3>
            <p className="text-[var(--color-text)] mt-1">{faq.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export const metadata = {
  title: 'Preguntas Frecuentes | Smart Energy',
  description: 'Resuelve tus dudas sobre la instalación, el monitoreo y la seguridad de nuestros sensores de consumo energético.',
};

export default Questions;
