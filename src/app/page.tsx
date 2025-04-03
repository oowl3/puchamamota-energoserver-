import { ThemeToggle } from "./components/ThemeToggle";
import Header_home from "./components/elements/header/Header_home";
export default function Home() {
  return (
    <div className="grid min-h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <Header_home/>
      
      {/* Contenido principal */}
      <main className="w-full max-w-4xl mt-20 px-4 sm:px-0"> 
      <div className="space-y-6">
    <h3>¿Qué hace?</h3>
    <p className="text-sm">Mide y optimiza la energía en tiempo real. Controla tu consumo eléctrico con precisión.</p>
    <h3>¿Por qué lo necesito?</h3>
    <p className="text-sm">Te ayuda a reducir el consumo energético, optimizando el uso de tus dispositivos y evitando costos innecesarios en tu factura reduciendo el desperdicio y ayudando a cuidar el medio ambiente.</p>
    
    <a href="https://www.youtube.com/watch?v=V99CluoQNLg" className="border-2 font-medium px-6 py-2 rounded-full transition-all duration-300 hover:bg-[var(--color-v-2)] hover:border-transparent"
          style={{
            borderColor: "var(--color-v-2)",
            color: "var(--color-text)",
          }}>Resuelve tus dudas aqui</a>
  </div>
  <div className="mt-8 space-y-8" >
  <h3 className="text-center ">
    ¿Dónde puedo comprarlo?
  </h3>
  
  <div className="flex justify-center space-x-8" >
    {/* Amazon */}
    <a
      href="https://www.amazon.com"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center"
    >
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPHQAcUpU4ack8TlcMotlvafXNm2QOajyQw&s"
        alt="Amazon"
        className="h-12 w-auto mb-2"
      />
      
    </a>
    
    {/* Mercado Libre */}
    <a
      href="https://www.mercadolibre.com"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center"
    >
      <img
        src="https://rappicard.mx/wp-content/uploads/2024/10/logo-mercado-libre.png"
        alt="Mercado Libre"
        className="h-12 w-auto mb-2"
      />
      
    </a>
    
    {/* Aquí (tu tienda propia) */}
    <a
      href="#"
      className="flex flex-col items-center"
    >
      <img
        src="/ruta/tu-logo.png"
        alt="Aquí"
        className="h-12 w-auto mb-2"
      />
      
    </a>
  </div>
</div>

        {/* Footer */}
        <footer className="mt-16 border-t border-[var(--color-v-6)] pt-8">
          <h6 className="text-sm font-semibold text-[var(--color-v-1)]">Email:</h6>
          <p className="mt-2 text-[var(--color-text)]">support@energoserver.mx</p>
        </footer>
      </main>

      {/* Toggle de tema */}
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}

