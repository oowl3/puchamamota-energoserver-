//import ElementoEj from "./components/Prueba/Elemento";
import { ThemeToggle } from "./components/ThemeToggle";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div>
          <h1>Energoserver</h1>
          <button className="bg-sky-400">Comenzar</button>
        </div>
        <div>
          <div><p></p></div>
          <div></div>
          <div></div>
        </div>
        <footer>
          <h6>Email:</h6>
          <p>support@energoserver.mx</p>
        </footer>
        <div><ThemeToggle/></div>
    </div>
  );
}
