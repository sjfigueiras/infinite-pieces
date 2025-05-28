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
  sketch: (analyser?: AnalyserNode) => (props: SketchProps) => void;
}

interface PieceMetadata {
  title: string;
  author: string;
  state: "draft" | "public" | "private" | "archived";
  tags?: string[];
}

export interface PieceEntry {
  metadata: PieceMetadata;
  loader: () => Promise<SonicPiece | VisualPiece>;
}

export type PieceType = "sonic" | "visual";

export type PieceRegistry = {
  [type in PieceType]: {
    [key: string]: PieceEntry;
  };
};

// Registry for dynamic imports
const pieceRegistry: PieceRegistry = {
  sonic: {
    entusiasmo: {
      metadata: {
        title: "Entusiasmo",
        author: "Santiago Figueiras",
        state: "public",
        tags: ["energetic"],
      },
      loader: async () =>
        (await import("./sonic/entusiasmo")).default as SonicPiece,
    },
    ondulado: {
      metadata: {
        title: "Ondulado",
        author: "Santiago Figueiras",
        state: "public",
        tags: ["wave"],
      },
      loader: async () =>
        (await import("./sonic/ondulado")).default as SonicPiece,
    },
    sweep: {
      metadata: {
        title: "Sweep",
        author: "Santiago Figueiras",
        state: "draft",
        tags: ["sweeping"],
      },
      loader: async () => (await import("./sonic/sweep")).default as SonicPiece,
    },
    noisy: {
      metadata: {
        title: "Noisy",
        author: "Santiago Figueiras",
        state: "draft",
        tags: ["noise"],
      },
      loader: async () => (await import("./sonic/noisy")).default as SonicPiece,
    },
    drone: {
      metadata: {
        title: "Drone",
        author: "Santiago Figueiras",
        state: "draft",
        tags: ["ambient"],
      },
      loader: async () => (await import("./sonic/drone")).default as SonicPiece,
    },
  },
  visual: {
    circle: {
      metadata: {
        title: "Circle",
        author: "Santiago Figueiras",
        state: "draft",
        tags: ["reactive"],
      },
      loader: async () =>
        (await import("./visual/audio-reactive/circle")).default as VisualPiece,
    },
    rects: {
      metadata: {
        title: "Skewed Rects",
        author: "Santiago Figueiras",
        state: "draft",
        tags: ["rects"],
      },
      loader: async () =>
        (await import("./visual/skewed-rects")).default as VisualPiece,
    },
    animatedGrid: {
      metadata: {
        title: "Animated Grid",
        author: "Santiago Figueiras",
        state: "draft",
        tags: ["grid", "animation"],
      },
      loader: async () =>
        (await import("./visual/animated-grid")).default as VisualPiece,
    },
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
  const entry = pieceRegistry[type][name];
  if (!entry) {
    throw new Error(`Piece "${name}" not found in the registry.`);
  }
  return entry.loader();
}

// Utility function to get metadata for a piece by name
export function getPieceMetadata(
  type: "sonic" | "visual",
  name: string,
): PieceMetadata | undefined {
  return pieceRegistry[type][name]?.metadata;
}

export const getRegistry = () => pieceRegistry;

export const getDefaultPiece = (type: PieceType): PieceEntry => {
  if (type === "sonic") {
    return pieceRegistry.sonic["entusiasmo"];
  }
  if (type === "visual") {
    return pieceRegistry.visual["circle"];
  }
  throw new Error(`No default piece for type: ${type}`);
};
