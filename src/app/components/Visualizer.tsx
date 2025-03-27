'use client';
import Player from "./Player";
import None from './sketches/None';
import { useEffect, useState } from "react";
import { Piece } from "./pieces/types";
import { defaultPiece, getPieceMetadataByKey } from "./pieces/catalog";
import { PieceMetadata } from "./pieces/catalog";

export default function Visualizer({ pieceKey }: { pieceKey?: PieceMetadata['key'] }) {
  const [loadedPiece, setLoadedPiece] = useState<Piece | null>(null);
  const pieceBasePath = './pieces/';
  const [pieceMetadata, setPiecemetadata] = useState<PieceMetadata>(defaultPiece());

  useEffect(() => {
    const loadPiece = async () => {
      /**
       * Sanitize the input parameter
       */
      console.log({pieceKey, pieceMetadata});
      if (pieceMetadata.key !== pieceKey) {
        let newPieceMetadata = getPieceMetadataByKey(pieceKey);
        console.log(pieceMetadata);
        const piece = await import(pieceBasePath + newPieceMetadata.key);
        setLoadedPiece(piece);
        setPiecemetadata(pieceMetadata);
      }
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