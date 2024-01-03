import type { Tile } from "./map";

export interface State {
  gs: GameState;
}

export interface GameState {
  map: Tile[][];
}
