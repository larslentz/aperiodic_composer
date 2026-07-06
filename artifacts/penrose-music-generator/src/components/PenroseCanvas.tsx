import React, { useEffect, useRef, useState } from "react";
import { Tile, PenroseTiling } from "@/lib/types";

interface PenroseCanvasProps {
  tiling: PenroseTiling | null;
  activeTileIds: string[];
}

export default function PenroseCanvas({ tiling, activeTileIds }: PenroseCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tiling) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Clear background
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Find bounds to scale correctly
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    tiling.tiles.forEach(tile => {
      tile.vertices.forEach(([x, y]) => {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      });
    });
    
    // Add padding
    const padding = 0.1;
    const boundsWidth = (maxX - minX) * (1 + padding * 2);
    const boundsHeight = (maxY - minY) * (1 + padding * 2);
    
    const scale = Math.min(rect.width / boundsWidth, rect.height / boundsHeight);
    
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    
    const offsetX = cx - ((minX + maxX) / 2) * scale;
    const offsetY = cy - ((minY + maxY) / 2) * scale;

    const activeSet = new Set(activeTileIds);

    // Draw tiles
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
        ctx.fillStyle = isActive ? "hsl(35, 100%, 60%)" : "hsl(180, 100%, 25%)"; // Amber if active, dark teal if not
      } else {
        ctx.fillStyle = isActive ? "hsl(35, 100%, 60%)" : "hsl(280, 40%, 30%)"; // Amber if active, dark purple if not
      }
      
      ctx.fill();
      
      ctx.strokeStyle = isActive ? "hsl(0, 0%, 100%)" : "hsl(220, 20%, 15%)";
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.stroke();
    });
    
  }, [tiling, activeTileIds]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full bg-card rounded-md border border-border shadow-inner"
      data-testid="penrose-canvas"
    />
  );
}
