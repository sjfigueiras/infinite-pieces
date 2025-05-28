import { Piece, PieceEntry } from "../pieces/registry";

interface CatalogItemProps {
  piece: PieceEntry;
}

const CatalogItem = ({ piece }: CatalogItemProps) => {
  const { metadata } = piece;

  const handleClick = async () => {};

  return (
    <li onClick={handleClick} className="catalog-item">
      <h3>{metadata.title}</h3>
      <p>Author: {metadata.author}</p>
      <p>State: {metadata.state}</p>
      <p>Tags: {metadata.tags?.join(", ") || "No tags"}</p>
    </li>
  );
};

export default CatalogItem;
