import { ThemeToggle } from "./components/ThemeToggle";
import Header_home from "./components/elements/header/Header_home";
import Footer_home from "./components/elements/footer/Footer_home";
import IconProp from "./components/IconProp";
import Navbar_home from "./components/elements/navbar/Navbar_home";

export default function Home() {
  return (
    <div className="grid min-h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      
      <Navbar_home/>
      
      <main className="w-full max-w-4xl mt-20 px-4 sm:px-0 space-y-20">
      <Header_home/>
        <div>
          <div className="tracking-[1.2rem] leading-[4rem]">
            <h1 className="font-urbanist text-[5.68rem] font-normal">Ahorro Control</h1>
            <h1 className="inline font-urbanist text-[6rem] tracking-[1rem] font-normal" style={{ color: 'var(--color-v-1)' }}>&  </h1> 
            <h1 className="inline font-urbanist text-[5.68rem] font-normal">Practicidad.</h1>
          </div>
          <div className="flex items-start">
            <div>
              <h1 className="inline" style={{ color: 'var(--color-v-1)' }}>Energoserver</h1>
              <h1 className="inline font-urbanist font-normal"> lo</h1>
              <h1 className="font-urbanist font-normal">hace posible.</h1>
            </div>
            <div>
              <img src="https://picsum.photos/200/300.webp" alt="Imagen magica " className="ml-3 w-100 h-75" />
            </div>
          </div>

        </div> 


        <div className="w-full h-px" style={{ backgroundColor: 'var(--color-v-4)' }}></div>


        <div className="space-y-4">
          <h3 className="font-urbanist font-normal">¿Qué hace?</h3>
          <p className="text-sm">Mide y optimiza la energía en tiempo real. Controla tu consumo eléctrico con precisión.</p>
          <h3 className="font-urbanist font-normal">¿Por qué lo necesito?</h3>
          <p className="text-sm">Te ayuda a reducir el consumo energético, optimizando el uso de tus dispositivos y evitando costos innecesarios en tu factura reduciendo el desperdicio y ayudando a cuidar el medio ambiente.</p>
        </div>


        <div className="w-full h-px" style={{ backgroundColor: 'var(--color-v-4)' }}></div>


        <div className="mt-8 space-y-8" style={{ borderColor: 'var(--color-v-4)' }}>
          <h3 className="text-center font-urbanist">¿Dónde puedo comprarlo? </h3>
          <div className="flex justify-center space-x-8" >
            {/* Amazon */}
            <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUPHQAcUpU4ack8TlcMotlvafXNm2QOajyQw&s"
                alt="Amazon"
                className="h-12 w-auto mb-2"
              />
            </a>
            
            {/* Mercado Libre */}
            <a href="https://www.mercadolibre.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
              <img
                src="https://rappicard.mx/wp-content/uploads/2024/10/logo-mercado-libre.png"
                alt="Mercado Libre"
                className="h-12 w-auto mb-2"
              />
            </a>
            
            {/* Aquí*/}
            <a href="https://www.youtube.com/watch?v=V99CluoQNLg" className="flex flex-col items-center">
              <div className="h-12 w-auto mb-2">
                <IconProp className="p-1" />
              </div>
            </a>
          </div>
        </div>

        <Footer_home/>
      </main>

      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}

