import React, { useEffect, useRef, useState } from "react";
import { Tile, PenroseTiling } from "@/lib/types";

interface PenroseCanvasProps {
  tiling: PenroseTiling | null;
  activeTileIds: string[];
  transparent?: boolean;
}

export default function PenroseCanvas({ tiling, activeTileIds, transparent = false }: PenroseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas || !tiling) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const pixelWidth = Math.round(rect.width * dpr);
      const pixelHeight = Math.round(rect.height * dpr);
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

      tiling.tiles.forEach(tile => {
        tile.vertices.forEach(([x, y]) => {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        });
      });

      const padding = 0.1;
      const boundsWidth = (maxX - minX) * (1 + padding * 2);
      const boundsHeight = (maxY - minY) * (1 + padding * 2);
      const scale = Math.min(rect.width / boundsWidth, rect.height / boundsHeight);
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const offsetX = cx - ((minX + maxX) / 2) * scale;
      const offsetY = cy - ((minY + maxY) / 2) * scale;

      const activeSet = new Set(activeTileIds);

      tiling.tiles.forEach(tile => {
        ctx.beginPath();

        tile.vertices.forEach(([x, y], i) => {
          const px = x * scale + offsetX;
          const py = y * scale + offsetY;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });

        ctx.closePath();

        const isActive = activeSet.has(tile.id);

        if (tile.type === "kite") {
          ctx.fillStyle = isActive ? "hsl(35, 100%, 60%)" : "hsl(180, 100%, 25%)";
        } else {
          ctx.fillStyle = isActive ? "hsl(35, 100%, 60%)" : "hsl(280, 40%, 30%)";
        }

        ctx.fill();

        ctx.strokeStyle = isActive ? "hsl(0, 0%, 100%)" : "hsl(220, 20%, 15%)";
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();
      });
    };

    drawRef.current = draw;
    draw();
  }, [tiling, activeTileIds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const redraw = () => drawRef.current();
    const observer = new ResizeObserver(redraw);
    observer.observe(canvas);
    window.addEventListener("resize", redraw);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", redraw);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`relative z-10 w-full h-full rounded-md border border-border shadow-inner ${transparent ? "bg-transparent" : "bg-card"}`}
      data-testid="penrose-canvas"
    />
  );
}
