import { Modulator } from "@/app/utils/tone-utils";
import { SketchProps } from "canvas-sketch";
import { CanvasSketchSettingsFunc } from "../components/Canvas";

export interface Piece {
  tags?: string[];
  title: string;
  author: string;
}

export interface SonicPiece extends Piece {
  modulators?: Modulator[];
}

export interface VisualPiece extends Piece {
  settings: CanvasSketchSettingsFunc;
  sketch: (audioComponent?: HTMLAudioElement) => (props: SketchProps) => void;
}

interface PieceRegistry {
  [type: string]: {
    [key: string]: () => Promise<SonicPiece | VisualPiece>;
  };
}

// Registry for dynamic imports
const pieceRegistry: PieceRegistry = {
  // Example: "pieceName": () => import("./path/to/piece"),
  // Add mappings here
  sonic: {
    entusiasmo: async () =>
      (await import("./sonic/entusiasmo")).default as SonicPiece,
    ondulado: async () =>
      (await import("./sonic/ondulado")).default as SonicPiece,
    sweep: async () => (await import("./sonic/sweep")).default as SonicPiece,
    noisy: async () => (await import("./sonic/noisy")).default as SonicPiece,
    loops: async () =>
      (await import("./sonic/loops")).default as SonicPiece,
    drone: async () => (await import("./sonic/drone")).default as SonicPiece,
    default: async () =>
      (await import("./sonic/entusiasmo")).default as SonicPiece,
  },
  visual: {
    default: async () =>
      (await import("./visual/audio-reactive/circle")).default as VisualPiece,
  },
};

// Utility function to dynamically import a piece by name
export async function loadPiece(
  type: "sonic" | "visual",
  name?: string,
): Promise<Piece> {
  if (!name) {
    throw new Error("Piece name is undefined");
  }
  const loader = pieceRegistry[type][name];
  if (!loader) {
    throw new Error(`Piece "${name}" not found in the registry.`);
  }
  return loader();
}
