export interface Catalog {
  [key: string]: PieceMetadata;
}

export interface PieceMetadata {
  key: string;
  name: string;
}

export const defaultPiece = () => catalog.entusiasmo;

/**
 * 
 * @param key PieceMetadata['key']
 * @returns The first PieceMetadata that matches the _key_ param,
 * otherwise returns the default PieceMetadata.
 */
export const getPieceMetadataByKey = (key?: PieceMetadata['key']) => {
  if (key === undefined) return defaultPiece();

  const search = Object.keys(catalog).find(k => k === key);
  return search && search.length > 0
    ? catalog[search[0]]
    : defaultPiece();
}

const catalog: Catalog = {
  entusiasmo: {
    key: "entusiasmo",
    name: "Entusiasmo"
  },
  "paisajes-ondulados": {
    key: "paisajes-ondulados",
    name: "Paisajes Ondulados"
  }
}

export default catalog;