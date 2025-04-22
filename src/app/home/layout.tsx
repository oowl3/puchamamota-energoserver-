import { ThemeToggle } from "../components/ThemeToggle"
import Header_home from "./safe_components/header/Header_home"

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
        </main>
        <div className="fixed bottom-4 right-4">
            <ThemeToggle />
        </div>
      </div>
    )
  }