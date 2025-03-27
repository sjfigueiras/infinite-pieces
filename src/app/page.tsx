import Image from "next/image";
import Player from "./components/Player";
import None from './components/sketches/None';

export default function Home() {
  return (
    <div>
      <main>
        <None />
      </main>
      <footer className="inset-x-0 bottom-0 row-start-3 p-8 flex gap-[24px] flex-wrap items-center justify-center absolute">
        <Player />
      </footer>
    </div>
  );
}
