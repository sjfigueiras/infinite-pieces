"use client";

import { Piece, VisualPiece, loadPiece } from "../pieces/registry";
import { useEffect, useState } from "react";
import Player from "./Player";
import Canvas, { CanvasSketchManager } from "./Canvas";

export default function Visualizer({ pieceTitle }: { pieceTitle?: string }) {
  const [loadedPiece, setLoadedPiece] = useState<Piece | undefined>(undefined);
  const [visualPiece, setVisualPiece] = useState<VisualPiece | undefined>(
    undefined,
  );
  const [audioComponent, setAudioComponent] = useState<
    HTMLAudioElement | undefined
  >(undefined);

  // TODO: add type for CanvasSketchManager
  const [manager, setManager] = useState<CanvasSketchManager | null>(null);

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

  useEffect(() => {
    if (manager) manager.pause();
  }, [manager]);

  const onPlay = () => {
    if (manager) {
      manager.play();
    }
  };

  const onPause = () => {
    if (manager) {
      manager.pause();
    }
  };

  return (
    <div>
      <main>
        {visualPiece && audioComponent && (
          <Canvas
            audioComponent={audioComponent}
            author={visualPiece.author}
            onPause={onPause}
            onPlay={onPlay}
            setManager={setManager}
            settings={visualPiece.settings}
            sketch={visualPiece.sketch}
            title={visualPiece.title}
          />
        )}
      </main>
      <footer className="inset-x-0 bottom-0 row-start-3 p-8 flex gap-[24px] flex-wrap items-center justify-center absolute">
        {loadedPiece && (
          <Player
            audioComponent={audioComponent}
            onPause={onPause}
            onPlay={onPlay}
            piece={loadedPiece}
            setAudioComponent={setAudioComponent}
          />
        )}
      </footer>
    </div>
  );
}
