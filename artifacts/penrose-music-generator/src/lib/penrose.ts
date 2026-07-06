import type { PenroseTiling, Tile, TileType } from "./types";

const PHI = (1 + Math.sqrt(5)) / 2;

type Point = [number, number];

interface Triangle {
  color: TileType; // "kite" (acute/red half) or "dart" (obtuse/blue half)
  a: Point;
  b: Point;
  c: Point;
}

function lerp(p: Point, q: Point, t: number): Point {
  return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
}

function subdivide(triangles: Triangle[]): Triangle[] {
  const next: Triangle[] = [];
  for (const tri of triangles) {
    const { color, a, b, c } = tri;
    if (color === "kite") {
      const p = lerp(a, b, 1 / PHI);
      next.push({ color: "kite", a: c, b: p, c: b });
      next.push({ color: "dart", a: p, b: c, c: a });
    } else {
      const q = lerp(b, a, 1 / PHI);
      const r = lerp(b, c, 1 / PHI);
      next.push({ color: "dart", a: r, b: c, c: a });
      next.push({ color: "dart", a: q, b: r, c: b });
      next.push({ color: "kite", a: r, b: q, c: a });
    }
  }
  return next;
}

function initialTriangles(): Triangle[] {
  const triangles: Triangle[] = [];
  const center: Point = [0, 0];
  for (let i = 0; i < 10; i++) {
    const angleA = ((2 * i - 1) * Math.PI) / 10;
    const angleB = ((2 * i + 1) * Math.PI) / 10;
    const pA: Point = [Math.cos(angleA), Math.sin(angleA)];
    const pB: Point = [Math.cos(angleB), Math.sin(angleB)];
    if (i % 2 === 0) {
      triangles.push({ color: "kite", a: center, b: pA, c: pB });
    } else {
      triangles.push({ color: "kite", a: center, b: pB, c: pA });
    }
  }
  return triangles;
}

function roundKey(p: Point): string {
  return `${p[0].toFixed(4)},${p[1].toFixed(4)}`;
}

function edgeKey(p: Point, q: Point): string {
  const a = roundKey(p);
  const b = roundKey(q);
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function generatePenroseTiling(depth: number): PenroseTiling {
  const clampedDepth = Math.max(1, Math.min(7, Math.round(depth)));
  let triangles = initialTriangles();
  for (let i = 0; i < clampedDepth; i++) {
    triangles = subdivide(triangles);
  }

  const tiles: Tile[] = triangles.map((tri, i) => {
    const vertices: [number, number][] = [tri.a, tri.b, tri.c];
    const cx = (tri.a[0] + tri.b[0] + tri.c[0]) / 3;
    const cy = (tri.a[1] + tri.b[1] + tri.c[1]) / 3;
    const angle = Math.atan2(cy, cx);
    return {
      id: `t${i}`,
      type: tri.color,
      vertices,
      center: [cx, cy],
      angle,
      depth: clampedDepth,
      neighbors: [],
    };
  });

  const edgeMap = new Map<string, string[]>();
  triangles.forEach((tri, i) => {
    const edges: [Point, Point][] = [
      [tri.a, tri.b],
      [tri.b, tri.c],
      [tri.c, tri.a],
    ];
    for (const [p, q] of edges) {
      const key = edgeKey(p, q);
      const list = edgeMap.get(key) ?? [];
      list.push(tiles[i].id);
      edgeMap.set(key, list);
    }
  });

  const neighborSets = new Map<string, Set<string>>();
  for (const tile of tiles) neighborSets.set(tile.id, new Set());
  for (const ids of edgeMap.values()) {
    if (ids.length < 2) continue;
    for (const idA of ids) {
      for (const idB of ids) {
        if (idA !== idB) neighborSets.get(idA)!.add(idB);
      }
    }
  }
  for (const tile of tiles) {
    tile.neighbors = Array.from(neighborSets.get(tile.id) ?? []);
  }

  return { tiles, depth: clampedDepth };
}

export function tileCount(depth: number): number {
  const clampedDepth = Math.max(1, Math.min(7, Math.round(depth)));
  let count = 10;
  for (let i = 0; i < clampedDepth; i++) {
    count = count; // triangle count grows non-uniformly (kite/dart mix); approximate below
  }
  return Math.round(10 * Math.pow(2.1, clampedDepth) * 0.5 + 10);
}
