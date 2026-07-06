import type { Tile, TraversalMode } from "./types";

function dist(p: [number, number]): number {
  return Math.sqrt(p[0] * p[0] + p[1] * p[1]);
}

function angleOf(p: [number, number]): number {
  const a = Math.atan2(p[1], p[0]);
  return a < 0 ? a + Math.PI * 2 : a;
}

function adjacencyWalk(tiles: Tile[]): Tile[] {
  if (tiles.length === 0) return [];
  const byId = new Map(tiles.map((t) => [t.id, t]));
  const start = [...tiles].sort((a, b) => dist(a.center) - dist(b.center))[0];
  const visited = new Set<string>();
  const order: Tile[] = [];
  const queue: string[] = [start.id];
  visited.add(start.id);
  while (queue.length > 0) {
    const id = queue.shift()!;
    const tile = byId.get(id);
    if (!tile) continue;
    order.push(tile);
    const sortedNeighbors = [...tile.neighbors].sort((a, b) => {
      const ta = byId.get(a);
      const tb = byId.get(b);
      if (!ta || !tb) return 0;
      return dist(ta.center) - dist(tb.center);
    });
    for (const n of sortedNeighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }
  const remaining = tiles
    .filter((t) => !visited.has(t.id))
    .sort((a, b) => dist(a.center) - dist(b.center));
  return [...order, ...remaining];
}

export function orderTiles(tiles: Tile[], mode: TraversalMode): Tile[] {
  switch (mode) {
    case "row-scan":
      return [...tiles].sort(
        (a, b) => a.center[1] - b.center[1] || a.center[0] - b.center[0],
      );
    case "radial":
      return [...tiles].sort((a, b) => dist(a.center) - dist(b.center));
    case "angle-sweep":
      return [...tiles].sort((a, b) => angleOf(a.center) - angleOf(b.center));
    case "spiral":
      return [...tiles].sort((a, b) => {
        const ra = dist(a.center);
        const rb = dist(b.center);
        const aa = angleOf(a.center);
        const ab = angleOf(b.center);
        return ra * 6 + aa - (rb * 6 + ab);
      });
    case "depth-order":
      return [...tiles].sort(
        (a, b) => a.depth - b.depth || dist(a.center) - dist(b.center),
      );
    case "adjacency-walk":
      return adjacencyWalk(tiles);
    default:
      return tiles;
  }
}
