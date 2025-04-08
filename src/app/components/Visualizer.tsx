"use client";

import { Piece, loadPiece } from "./pieces/types";
import { useEffect, useState } from "react";
import Player from "./Player";
import SkewedRect from "./CanvasSketch";

export default function Visualizer({ pieceTitle }: { pieceTitle?: string }) {
  const [loadedPiece, setLoadedPiece] = useState<Piece | undefined>(undefined);

  useEffect(() => {
    const loadPieceEffect = async () => {
      console.log({ pieceTitle, loadedPiece });
      if (pieceTitle && !loadedPiece) {
        try {
          const pieceEntry = await loadPiece(pieceTitle);
          setLoadedPiece(pieceEntry);
        } catch (error) {
          console.error(`Error loading piece with key "${pieceTitle}":`, error);
        }
      }
    };
    loadPieceEffect();
  }, [pieceTitle, loadedPiece]);

  return (
    <div>
      <main>
        <SkewedRect />
      </main>
      <footer className="inset-x-0 bottom-0 row-start-3 p-8 flex gap-[24px] flex-wrap items-center justify-center absolute">
        {loadedPiece && <Player piece={loadedPiece} />}
      </footer>
    </div>
  );
}
