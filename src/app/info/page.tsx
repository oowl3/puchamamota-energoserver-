import React from 'react';
import Header_start from '../components/elements/header/Header_start';
import Footer_start from '../components/elements/footer/Footer_start';
import { ThemeToggle } from '../components/ThemeToggle';

const Policies = () => {
  return (
    <div className="min-h-screen">
      <Header_start/>
      
        <div className="container mx-auto px-4 py-8 max-w-4xl text-[var(--color-text)] border-t-[3rem]">
            <h1 className="text-3xl font-urbanist font-normal text-center mb-8  ">AVISO DE PRIVACIDAD</h1>
            
            <div className="border border-[var(--color-v-1)] p-6 rounded-lg shadow-md">
            <section className="mb-8">
                <p className="mb-4">
                Energoserver, mejor conocido como Energoserver, con domicilio en calle x, colonia Centro, ciudad Lerdo, 
                municipio o delegación Lerdo, c.p. 35150, en la entidad de Dgo., país México, y portal de internet 
                support@energoserver.mx, es el responsable del uso y protección de sus datos personales, y al respecto 
                le informamos lo siguiente:
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-urbanist font-normal mb-4 text-[var(--color-v-1)]">¿Para qué fines utilizaremos sus datos personales?</h2>
                <p className="mb-4">
                Los datos personales que recabamos de usted, los utilizaremos para las siguientes finalidades que son necesarias
                para el servicio que solicita:
                </p>
                <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Monitoreo y análisis del consumo eléctrico de dispositivos</li>
                <li className="mb-2">Gestión de roles y permisos de usuarios dentro del sistema</li>
                <li className="mb-2">Prospección comercial</li>
                </ul>
                
                <p className="mb-4">
                De manera adicional, utilizaremos su información personal para las siguientes finalidades secundarias que no son
                <strong> necesarias para el servicio solicitado</strong>, pero que nos permiten y facilitan brindarle una mejor atención:
                </p>
                <ul className="list-disc pl-6 mb-4">
                <li className="mb-2">Atención a dudas frecuentes y soporte técnico</li>
                <li className="mb-2">Estadísticas generales para mejorar el servicio (uso anonimizado)</li>
                <li className="mb-2">Registro del usuario y autenticación en el sistema</li>
                </ul>
                
                <p className="mb-4">
                En caso de que no desee que sus datos personales se utilicen para estos fines secundarios, puede indicarlo
                a través del correo electrónico: support@energoserver.mx
                </p>
                
                <p className="mb-4">
                La negativa para el uso de sus datos personales para estas finalidades no podrá ser un motivo para que le neguemos
                los servicios y productos que solicita o contrata con nosotros.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-urbanist font-normal mb-4 text-[var(--color-v-1)]">¿Qué datos personales utilizaremos para estos fines?</h2>
                <p className="mb-4">
                Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, utilizaremos los siguientes datos
                personales:
                </p>
                <ul className="list-disc pl-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                <li>Nombre</li>
                <li>Teléfono celular</li>
                <li>Correo electrónico</li>
                <li>Edad</li>
                <li>Género</li>
                <li>Tarifa eléctrica</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-urbanist font-normal mb-4 text-[var(--color-v-1)]">¿Cómo puede acceder, rectificar o cancelar sus datos personales, u oponerse a su uso?</h2>
                <p className="mb-4">
                Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del
                uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de
                que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases
                de datos cuando considere que la misma no está siendo utilizada adecuadamente (Cancelación); así como oponerse
                al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.
                </p>
                
                <p className="mb-4">
                Para el ejercicio de cualquiera de los derechos ARCO, usted deberá presentar la solicitud respectiva a través del
                siguiente medio:
                </p>
                
                <div className="border border-[var(--color-v-0)] p-4 rounded-md mb-4">
                <p className="font-medium">Correo electrónico: support@energoserver.mx</p>
                <p>o a través del sitio web oficial: <a href="https://energoserver.mx" className="text-[var(--color-v-2_1)] hover:underline">https://energoserver.mx</a>, en la sección &quot;Privacidad y Datos Personales&quot;.</p>
                </div>
                
                <p className="mb-4">
                Dicha solicitud deberá contener: el nombre completo del titular, un medio para comunicarle la respuesta, copia de una
                identificación oficial vigente, una descripción clara y precisa de los datos respecto de los cuales desea ejercer sus
                derechos, así como cualquier otro elemento que facilite la localización de la información.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-urbanist font-normal mb-4 text-[var(--color-v-1)]">Usted puede revocar su consentimiento para el uso de sus datos personales</h2>
                <p className="mb-4">
                Usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus
                datos personales. Sin embargo, es importante que tenga en cuenta que no en todos los casos podremos atender su
                solicitud o concluir el uso de forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir
                tratando sus datos personales.
                </p>
                
                <p className="mb-4">
                Para revocar su consentimiento deberá presentar su solicitud a través del siguiente medio:
                </p>
                
                <div className="border border-[var(--color-v-0)] p-4 rounded-md mb-4">
                <p className="font-medium">Correo electrónico: support@energoserver.mx</p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-urbanist font-normal mb-4 text-[var(--color-v-1)]">¿Cómo puede limitar el uso o divulgación de su información personal?</h2>
                <p className="mb-4">
                Con objeto de que usted pueda limitar el uso y divulgación de su información personal, le ofrecemos los siguientes
                medios:
                </p>
                
                <div className="border border-[var(--color-v-0)] p-4 rounded-md mb-4">
                <p>
                    El titular podrá limitar el uso de sus datos personales para finalidades no esenciales (como promociones o avisos
                    informativos) enviando una solicitud al correo electrónico support@energoserver.mx.
                </p>
                </div>
                
                <p className="mb-4">
                Energoserver no transfiere ni divulga los datos personales a terceros ajenos, salvo obligación legal. Todas las finalidades
                del tratamiento están relacionadas únicamente con el funcionamiento del sistema, la administración de alertas de consumo
                y la mejora de la experiencia del usuario.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-urbanist font-normal mb-4 text-[var(--color-v-1)]">¿Cómo puede conocer los cambios en este aviso de privacidad?</h2>
                <p className="mb-4">
                El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos
                requerimientos legales; de nuestras propias necesidades por los productos o servicios que ofrecemos; de nuestras
                prácticas de privacidad; de cambios en nuestro modelo de negocio, o por otras causas.
                </p>
                
                <p className="mb-4">
                Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad, a
                través de: Los cambios o actualizaciones al presente Aviso de Privacidad serán comunicados al titular por medio de
                correo electrónico o vía telefónica, utilizando los datos de contacto que haya proporcionado al momento de su
                registro.
                </p>
            </section>

            <section className="mb-4">
                <p className="text-sm">Última actualización: 17/04/2025</p>
            </section>
            </div>
        </div>
        <div className="fixed bottom-4 right-4">
            <ThemeToggle />
        </div>
        <Footer_start />
    </div>
  );
};

export default Policies;