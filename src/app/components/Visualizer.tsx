"use client";

import { Piece, VisualPiece, loadPiece } from "../pieces/registry";
import { useEffect, useState } from "react";
import Player from "./Player";
import Canvas from "./Canvas";

export default function Visualizer({ pieceTitle }: { pieceTitle?: string }) {
  const [loadedPiece, setLoadedPiece] = useState<Piece | undefined>(undefined);
  const [visualPiece, setVisualPiece] = useState<VisualPiece | undefined>(
    undefined,
  );

  useEffect(() => {
    const loadSonicPieceEffect = async () => {
      console.log({ pieceTitle, loadedPiece });
      if (pieceTitle && !loadedPiece) {
        try {
          const pieceEntry = await loadPiece("sonic", pieceTitle);
          setLoadedPiece(pieceEntry);
        } catch (error) {
          console.error(`Error loading piece with key "${pieceTitle}":`, error);
        }
      }
    };
    loadSonicPieceEffect();
  }, [pieceTitle, loadedPiece]);

  useEffect(() => {
    const loadVisualPiece = async () => {
      try {
        const loadedVisualPiece = await loadPiece("visual", "default");
        if (loadedVisualPiece) {
          setVisualPiece(loadedVisualPiece as VisualPiece);
        }
      } catch (error) {
        console.error("Error loading visual piece:", error);
      }
    };

    loadVisualPiece();
  }, []);

  return (
    <div>
      <main>
        {visualPiece && (
          <Canvas
            title={visualPiece.title}
            settings={visualPiece.settings}
            sketch={visualPiece.sketch}
          />
        )}
      </main>
      <footer className="inset-x-0 bottom-0 row-start-3 p-8 flex gap-[24px] flex-wrap items-center justify-center absolute">
        {loadedPiece && <Player piece={loadedPiece} />}
      </footer>
    </div>
  );
}
