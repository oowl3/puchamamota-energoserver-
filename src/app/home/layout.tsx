import { ThemeToggle } from "../components/ThemeToggle"
import Header_home from "./safe_components/header/Header_home"
import { Toaster } from 'react-hot-toast'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Header_home />
      <main>
        {children}
        
        {/* Aquí agregamos el Toaster */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              backgroundColor: '#fef3c7',
              color: '#92400e',
              maxWidth: '500px'
            }
          }}
        />
      </main>
      
      <div className="fixed bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  )
}