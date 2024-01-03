import type { Tile, Pos } from "../model";
import { TerrainType } from "../model";

/*
Hexagonal coordinates systems used: 2 dimensions, offset X by 1 every 2 rows
Note: a cube coordinates system would make more elegant algorithms, maybe a TODO for refactoring
      see this for inspiration: https://www.redblobgames.com/grids/hexagons/
      anyways the game engine use a few functions in this module that abstract the coordinate system
      refactoring might only be useful if AI has to use these algorithms many times quickly
*/

export const MAP_SIZE = 20;

export function makeNewMap(): Tile[][] {
  const map: Tile[][] = [];
  for (let x = 0; x < MAP_SIZE; x++) {
    map[x] = [];
    for (let y = 0; y < MAP_SIZE; y++) {
      map[x].push({
        terrain:
          Math.random() > 0.2 ? TerrainType.Mountain : TerrainType.Plains,
      });
    }
  }
  return map;
}

export function getAdjacentPositions(pos: Pos): Pos[] {
  const positions = [];
  const shiftX = pos.y % 2 === 0 ? -1 : 0;
  positions.push({ x: pos.x - 1, y: pos.y });
  positions.push({ x: pos.x + 1, y: pos.y });
  positions.push({ x: pos.x + shiftX, y: pos.y - 1 });
  positions.push({ x: pos.x + shiftX + 1, y: pos.y - 1 });
  positions.push({ x: pos.x + shiftX, y: pos.y + 1 });
  positions.push({ x: pos.x + shiftX + 1, y: pos.y + 1 });
  return getPositionsInsideTheMap(positions);
}

export function getPositionsInRange(pos: Pos, range: number): Pos[] {
  const positions = [];
  for (let x = pos.x - range; x <= pos.x + range; x++) {
    for (
      let y = pos.y - range + Math.max(0, pos.x - x);
      y <= pos.y + range - Math.max(0, x - pos.x);
      y++
    ) {
      const shiftX = pos.y % 2 === 1 && y % 2 === 0 ? 1 : 0;
      positions.push({ x: x + Math.floor((y - pos.y) / 2) + shiftX, y });
    }
  }
  return getPositionsInsideTheMap(positions);
}

export function getDistance(pos1: Pos, pos2: Pos): number {
  let x1 = pos1.x;
  let x2 = pos2.x;
  const y1 = pos1.y;
  const y2 = pos2.y;
  // un-apply offset
  x1 -= Math.floor(y1 / 2);
  x2 -= Math.floor(y2 / 2);
  // distance calc : if x and y change in the same direction, add up distances on each dimension
  // else, the max projected distance on either dimension is the distance (the other dim is irrelevant, doesn't add to the dist)
  const xDiff = x1 - x2;
  const yDiff = y1 - y2;
  if ((xDiff >= 0 && yDiff >= 0) || (xDiff <= 0 && yDiff <= 0)) {
    return Math.abs(xDiff) + Math.abs(yDiff);
  } else {
    return Math.max(Math.abs(xDiff), Math.abs(yDiff));
  }
}

export function getPositionsInsideTheMap(posArray: Pos[]): Pos[] {
  return posArray.filter(
    (p) => p.x >= 0 && p.x < MAP_SIZE && p.y >= 0 && p.y < MAP_SIZE
  );
}
