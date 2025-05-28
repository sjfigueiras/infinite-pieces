import { PieceEntry } from "../pieces/registry";
import Link from "next/link";

interface CatalogItemProps {
  piece: PieceEntry;
}

const CatalogItem = ({ piece }: CatalogItemProps) => {
  const { metadata } = piece;

  const pieceLink = `/pieces/${metadata.id}`;

  return (
    <li className="catalog-item p-4 space-y-2">
      <h3 className="text-lg font-bold">
        <Link href={pieceLink} className="text-blue-600 hover:underline">
          {metadata.title}
        </Link>
      </h3>
      <p className="text-sm text-gray-700">Author: {metadata.author}</p>
      <p className="text-sm">
        State:{" "}
        <span
          className={`px-2 py-1 rounded text-white ${
            metadata.state === "public" ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          {metadata.state}
        </span>
      </p>
      <p className="text-sm">
        {metadata.tags?.length ? (
          metadata.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))
        ) : (
          <span className="text-gray-500">No tags</span>
        )}
      </p>
    </li>
  );
};

export default CatalogItem;
