import ElementoEj from "./components/Prueba/Elemento";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ElementoEj/>
        <div>
          <h3>Email:</h3>
          <h5>support@energoserver.mx</h5>
        </div>
    </div>
  );
}
