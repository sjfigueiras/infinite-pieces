'use client';
import Player from "./components/Player";
import None from './components/sketches/None';
import { useEffect, useState } from "react";
import { Piece } from "./components/pieces/types";

export default function Home() {
  const [loadedPiece, setLoadedPiece] = useState<Piece | null>(null);
  const piecePath = './components/pieces/entusiasmo';

  useEffect(() => {
    const loadPiece = async () => {
      const piece = await import(piecePath);
      setLoadedPiece(piece);
    }
    loadPiece();
  });

  return (
    <div>
      <main>
        <None />
      </main>
      <footer className="inset-x-0 bottom-0 row-start-3 p-8 flex gap-[24px] flex-wrap items-center justify-center absolute">
        {
          loadedPiece && <Player piece={loadedPiece} />
        }
      </footer>
    </div>
  );
}
