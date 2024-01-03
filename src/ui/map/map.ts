export const PADDING = 20;
export const TILE_HEIGHT = 75;
export const TILE_WIDTH = (Math.sqrt(3) / 2) * TILE_HEIGHT;

export function getTilePixelPos(
  x: number,
  y: number
): { tx: number; ty: number } {
  const tx = (x + Math.ceil(y % 2) / 2) * TILE_WIDTH + PADDING;
  const ty = y * (TILE_HEIGHT * 0.75) + PADDING;
  return { tx, ty };
}
