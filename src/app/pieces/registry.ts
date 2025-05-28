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
  id: string;
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
        id: "entusiasmo",
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
        id: "ondulado",
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
        id: "sweep",
        title: "Sweep",
        author: "Santiago Figueiras",
        state: "draft",
        tags: ["sweeping"],
      },
      loader: async () => (await import("./sonic/sweep")).default as SonicPiece,
    },
    noisy: {
      metadata: {
        id: "noisy",
        title: "Noisy",
        author: "Santiago Figueiras",
        state: "draft",
        tags: ["noise"],
      },
      loader: async () => (await import("./sonic/noisy")).default as SonicPiece,
    },
    drone: {
      metadata: {
        id: "drone",
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
        id: "circle",
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
        id: "rects",
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
        id: "animatedGrid",
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
    return getDefaultPiece(type).loader();
  }
  return entry.loader();
}

// Utility function to get metadata for a piece by name
export function getPieceMetadata(
  type: "sonic" | "visual",
  id: string,
): PieceMetadata | undefined {
  return pieceRegistry[type][id]?.metadata;
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
