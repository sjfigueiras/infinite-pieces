import { getRegistry } from "@/app/pieces/registry";
import CatalogItem from "./CatalogItem";

const Catalog = () => {
  const catalog = getRegistry();
  return (
    <div className="catalog">
      <h1>Catalog</h1>
      <ul>
        {Object.entries(catalog).map(([type, pieces]) => (
          <li key={type}>
            <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Pieces</h2>
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
