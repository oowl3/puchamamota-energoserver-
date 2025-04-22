import { ThemeToggle } from "../components/ThemeToggle"

export default function HomeLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-scree">
        <main>
          {children}
        </main>
        <div className="fixed bottom-4 right-4">
            <ThemeToggle />
        </div>
      </div>
    )
  }