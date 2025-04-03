import { ThemeToggle } from "./components/ThemeToggle";
import Header_home from "./components/elements/header/Header_home";
export default function Home() {
  return (
    <div className="grid min-h-screen items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <Header_home/>
      
      {/* Contenido principal */}
      <main className="w-full max-w-4xl mt-20 px-4 sm:px-0"> 
        <div className="space-y-8">
          <section>
            <p className="text-[var(--color-text)]">Contenido principal aquí...</p>
          </section>
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
