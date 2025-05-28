import { getRegistry } from "@/app/pieces/registry";
import CatalogItem from "./CatalogItem";

const Catalog = () => {
  const catalog = getRegistry();
  return (
    <div className="catalog">
      <ul>
        {Object.entries(catalog).map(([type, pieces]) => (
          <li key={type} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {type.charAt(0).toUpperCase() + type.slice(1)} Pieces
            </h2>
            <ul>
              {Object.values(pieces).map((piece) => (
                <CatalogItem key={piece.metadata.title} piece={piece} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Catalog;
