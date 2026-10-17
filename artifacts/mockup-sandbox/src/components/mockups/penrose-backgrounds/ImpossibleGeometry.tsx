import React from "react";
import "./_group.css";
import ComposerPreview from "./ComposerPreview";

function ImpossibleStage() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-md bg-[#10191d]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(40,67,70,0.22),transparent_62%)]" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 760"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="paradox-line" x1="300" y1="30" x2="700" y2="190" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ddd0ae" stopOpacity=".96" />
            <stop offset=".52" stopColor="#b5c5b8" stopOpacity=".86" />
            <stop offset="1" stopColor="#ddd0ae" stopOpacity=".96" />
          </linearGradient>
          <linearGradient id="paradox-shadow" x1="290" y1="70" x2="710" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#71857c" stopOpacity=".30" />
            <stop offset="1" stopColor="#b9a982" stopOpacity=".22" />
          </linearGradient>
        </defs>

        {/* Bright, compact Penrose tribar: its whole silhouette sits above the tile disk. */}
        <g stroke="#d8caab" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
          {/* Three solid axonometric beams form the paradoxical closed loop. */}
          <path d="m500 28 20 13-145 105-23-14Z" fill="#263638" fillOpacity=".94" />
          <path d="m352 132 23 14h250l23-14-20-13H372Z" fill="#263638" fillOpacity=".94" />
          <path d="m625 132 23 14-128-105-20-13Z" fill="#263638" fillOpacity=".94" />
          <path d="m500 28 20 13 128 105m-276-14 23 14 125-91m-125 91h250l23-14" />
          {/* Short cross-treads unmistakably read as stairs, not a generic wireframe. */}
          <path d="m475 46 20 13m-49 5 20 13m-49 5 20 13m-49 5 20 13" strokeWidth="1.8" />
          <path d="M402 139h37m17 0h37m17 0h37m17 0h37" strokeWidth="1.8" />
          <path d="m581 78 20 16m-38 0 20 16m-38 0 20 16" strokeWidth="1.8" />
          {/* Deliberate over/under interruption at the crown sells the impossible join. */}
          <path d="m488 37 23 14" stroke="#10191d" strokeWidth="6" />
          <path d="m493 39 14 9" stroke="#d8caab" strokeWidth="2.4" />
        </g>

        {/* Two cropped stair flights sit in the side gutters, outside the live tile field. */}
        <g stroke="url(#paradox-line)" strokeWidth="1.5" strokeLinejoin="round" opacity=".7">
          <path d="M18 302h32v-24h32v-24h32v-24h32v-24h32v-24h32" />
          <path d="M18 316h32v-24h32v-24h32v-24h32v-24h32v-24h32" opacity=".52" />
          <path d="M982 302h-32v-24h-32v-24h-32v-24h-32v-24h-32v-24h-32" />
          <path d="M982 316h-32v-24h-32v-24h-32v-24h-32v-24h-32v-24h-32" opacity=".52" />
          <path d="M18 302v58m192-178v52m772 68v58m-192-178v52" opacity=".45" />
        </g>

        {/* Sparse drafting registrations reinforce the measured architectural plate. */}
        <g stroke="#a3b5a9" strokeWidth=".8" opacity=".24">
          <path d="M32 86h94M874 86h94M32 678h88M880 678h88" />
          <path d="M40 218h126M834 218h126" strokeDasharray="2 7" />
          <path d="M500 12v11M286 160h16m396 0h16" />
          <circle cx="500" cy="26" r="3" fill="#d0c29f" stroke="none" />
          <circle cx="347" cy="159" r="3" fill="#d0c29f" stroke="none" />
          <circle cx="617" cy="159" r="3" fill="#d0c29f" stroke="none" />
        </g>
      </svg>
      <svg
        className="absolute left-1/2 top-7 h-[118px] w-[min(560px,72%)] -translate-x-1/2"
        viewBox="0 0 560 120"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#d8caab" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="m280 5 17 10-137 97-20-12Z" fill="#263638" strokeOpacity=".96" />
          <path d="m140 100 20 12h240l20-12-17-10H157Z" fill="#263638" strokeOpacity=".96" />
          <path d="m403 90 17 10-123-85-17-10Z" fill="#263638" strokeOpacity=".96" />
          <path d="m280 5 17 10 123 85m-280 0 20 12 120-85m-120 85h240l20-12" />
          <path d="m258 21 17 12m-42 1 17 12m-42 1 17 12m-42 1 17 12" strokeWidth="1.8" />
          <path d="M180 106h36m15 0h36m15 0h36m15 0h36m15 0h30" strokeWidth="1.8" />
          <path d="m361 49 18 14m-35 0 18 14m-35 0 18 14" strokeWidth="1.8" />
          <path d="m269 9 20 12" stroke="#10191d" strokeWidth="6" />
          <path d="m273 11 12 8" stroke="#d8caab" strokeWidth="2.4" />
        </g>
      </svg>
      <div className="absolute inset-x-7 top-5 flex items-start justify-between text-[9px] font-mono uppercase tracking-[0.24em] text-[#d0c5a6]/40">
        <span>Fig. 03 / Impossible ascent</span>
        <span>Axonometric study · 1958</span>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,17,19,.12),transparent_18%,transparent_82%,rgba(10,17,19,.12))]" />
    </div>
  );
}

export function ImpossibleGeometry() {
  return (
    <ComposerPreview
      transparentCanvas
      backgroundLayer={<ImpossibleStage />}
    />
  );
}
