import "./_group.css";
import ComposerPreview from "./ComposerPreview";

function GeometryField() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-md bg-[#101519]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_46%,rgba(73,112,109,0.17),transparent_54%),linear-gradient(132deg,#141b1d_0%,#0c1115_58%,#131719_100%)]" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.48]"
        viewBox="0 0 1200 760"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="aperiodic-grid" width="186" height="160" patternUnits="userSpaceOnUse" patternTransform="rotate(-7)">
            <path d="M0 80 45 0 93 80 45 160Z" stroke="#a3b8a9" strokeOpacity=".16" strokeWidth="1" />
            <path d="M93 80 139 0 186 80 139 160Z" stroke="#b49b6f" strokeOpacity=".15" strokeWidth="1" />
            <path d="M45 0 139 0M45 160 139 160M0 80h186" stroke="#d0c5a3" strokeOpacity=".09" strokeWidth=".8" />
            <path d="M45 0 93 80 139 0M45 160 93 80 139 160" stroke="#8aa79f" strokeOpacity=".13" strokeWidth=".8" />
            <circle cx="93" cy="80" r="2" fill="#d3b781" fillOpacity=".33" />
          </pattern>
          <linearGradient id="field-fade" x1="0" y1="0" x2="1200" y2="760" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity=".88" />
            <stop offset=".48" stopColor="white" stopOpacity=".72" />
            <stop offset="1" stopColor="white" stopOpacity=".9" />
          </linearGradient>
          <mask id="field-mask">
            <rect width="1200" height="760" fill="url(#field-fade)" />
          </mask>
        </defs>

        <rect width="1200" height="760" fill="url(#aperiodic-grid)" mask="url(#field-mask)" />

        {/* A sparse, non-periodic constellation of golden-ratio kite/dart seams. */}
        <g stroke="#d4c29a" strokeOpacity=".25" strokeWidth="1">
          <path d="M64 124 128 78 177 144 128 215Z" />
          <path d="m128 78 72-52 61 79-84 39" />
          <path d="m177 144 84-39 48 66-74 71Z" />
          <path d="m261 105 54-79 77 54-83 91" />
          <path d="m630 99 64-47 48 70-55 83Z" />
          <path d="m694 52 80-61 68 77-100 54" />
          <path d="m742 122 100-54 46 71-83 66Z" />
          <path d="m842 68 61-78 81 54-79 95" />
          <path d="m102 543 72-52 58 82-75 69Z" />
          <path d="m174 491 86-68 58 83-86 67" />
          <path d="m232 573 86-67 67 76-78 88Z" />
          <path d="m318 506 59-83 78 50-70 109" />
          <path d="m720 574 74-58 59 78-83 72Z" />
          <path d="m794 516 79-65 70 73-90 70" />
          <path d="m853 594 90-70 65 77-81 80Z" />
          <path d="m943 524 63-73 73 51-71 99" />
        </g>
        <g fill="#dec89a" fillOpacity=".55">
          <circle cx="128" cy="78" r="2" /><circle cx="261" cy="105" r="1.6" />
          <circle cx="694" cy="52" r="2" /><circle cx="842" cy="68" r="1.6" />
          <circle cx="174" cy="491" r="2" /><circle cx="318" cy="506" r="1.6" />
          <circle cx="794" cy="516" r="2" /><circle cx="943" cy="524" r="1.6" />
        </g>

        {/* Fine angular traces, weighted toward the stage margins to protect tile contrast. */}
        <g stroke="#829c91" strokeOpacity=".19" strokeWidth=".8">
          <path d="M0 318 90 276 165 316 238 263 319 302 402 245" />
          <path d="M830 300 905 252 980 285 1064 226 1200 270" />
          <path d="M0 420 83 390 164 433 244 382 326 420" />
          <path d="M886 414 966 375 1044 419 1121 370 1200 400" />
          <path d="M390 0 428 62 477 17 526 91" />
          <path d="M594 760 638 691 684 733 730 672" />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(5,9,11,0.28)_100%)]" />
    </div>
  );
}

export function AperiodicGeometry() {
  return (
    <ComposerPreview
      backgroundLayer={<GeometryField />}
      transparentCanvas
    />
  );
}
