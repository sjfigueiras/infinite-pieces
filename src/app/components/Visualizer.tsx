"use client";

import { Piece, VisualPiece, loadPiece } from "../pieces/registry";
import { useEffect, useState } from "react";
import Player from "./Player";
import Canvas, { CanvasSketchManager } from "./Canvas";

// TODO: review if we want to have Tone as a dependency
// at this level. This may be an abstraction leak.
import * as Tone from "tone";

export default function Visualizer({ pieceTitle }: { pieceTitle?: string }) {
  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>(undefined);
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

  useEffect(() => {
    if (audioComponent) {
      // Let's make sure we get the same context
      // as the Piece.
      // If we create a new context, we would be
      // analysing the wrong audio stream.
      const audioContext = Tone.getContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024; // Adjust FFT size as needed

      // Connect Tone.js master output to the analyser
      Tone.getDestination().connect(analyser);

      setAnalyser(analyser);
    }
  }, [audioComponent]);

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
            analyser={analyser}
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
            theme="light"
          />
        )}
      </footer>
    </div>
  );
}
