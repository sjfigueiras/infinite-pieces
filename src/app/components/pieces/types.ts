import { Modulator } from "@/app/utils/tone-utils";

export interface Piece {
    title: string;
    modulators: Modulator[];
}

// Registry for dynamic imports
const pieceRegistry: Record<string, () => Promise<Piece>> = {
    // Example: "pieceName": () => import("./path/to/piece"),
    // Add mappings here
    entusiasmo: async () => (await (import("./entusiasmo"))).default as Piece,
    ondulado: async () => (await (import("./ondulado"))).default as Piece,
    default: async () => (await (import("./entusiasmo"))).default as Piece,
    // Add more pieces as needed
};

// Utility function to dynamically import a piece by name
export async function loadPiece(name?: string): Promise<Piece> {
    if (!name) {
        throw new Error('Piece name is undefined');
    }
    const loader = pieceRegistry[name];
    if (!loader) {
        throw new Error(`Piece "${name}" not found in the registry.`);
    }
    return loader();
}