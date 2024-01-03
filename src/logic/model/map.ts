export interface Tile {
  terrain: TerrainType;
}

export interface Pos {
  x: number;
  y: number;
}

export enum TerrainType {
  Plains = "PLAINS",
  Hills = "HILLS",
  Mountain = "MOUNTAIN",
  Water = "WATER",
}
