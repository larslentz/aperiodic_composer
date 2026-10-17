import React from "react";
import "./_group.css";
import ComposerPreview from "./ComposerPreview";

function AeonField() {
  return (
    <div className="aeon-field">
      <div className="aeon-field__depth" />
      <svg className="aeon-field__geometry" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="aeon-core">
            <stop offset="0" stopColor="#d6a56c" stopOpacity=".16" />
            <stop offset=".34" stopColor="#8b6b58" stopOpacity=".07" />
            <stop offset="1" stopColor="#07151c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="horizon-line" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#a6d3c2" stopOpacity="0" />
            <stop offset=".48" stopColor="#a6d3c2" stopOpacity=".42" />
            <stop offset="1" stopColor="#dfb88a" stopOpacity=".08" />
          </linearGradient>
        </defs>
        <ellipse cx="792" cy="374" rx="536" ry="386" fill="url(#aeon-core)" />
        <g fill="none" stroke="url(#horizon-line)" strokeWidth="1">
          <ellipse cx="796" cy="375" rx="242" ry="146" transform="rotate(-17 796 375)" opacity=".4" />
          <ellipse cx="796" cy="375" rx="319" ry="198" transform="rotate(-17 796 375)" opacity=".3" />
          <ellipse cx="796" cy="375" rx="397" ry="251" transform="rotate(-17 796 375)" opacity=".23" />
          <ellipse cx="796" cy="375" rx="477" ry="306" transform="rotate(-17 796 375)" opacity=".16" />
          <path d="M-80 650C173 532 237 276 448 185c156-67 268 32 374 77 132 56 262 5 461-158" opacity=".38" />
          <path d="M-48 707C214 584 287 324 487 236c147-65 247 28 361 79 140 63 278 23 413-74" opacity=".22" />
          <path d="M-32 122C189 265 353 310 531 246c149-54 246-182 423-178 103 2 193 51 295 107" opacity=".15" />
        </g>
        <g fill="#d6b48e" opacity=".48">
          <circle cx="567" cy="174" r="1.4" /><circle cx="1039" cy="239" r="1.2" />
          <circle cx="963" cy="587" r="1.1" /><circle cx="353" cy="482" r="1" />
          <circle cx="1104" cy="411" r="1.2" /><circle cx="724" cy="650" r=".9" />
        </g>
      </svg>
      <div className="aeon-field__veil" />
      <style>{`
        .aeon-field {
          position: absolute;
          inset: 0;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(ellipse at 70% 47%, rgba(46, 76, 74, .34), transparent 49%),
            radial-gradient(ellipse at 9% 100%, rgba(28, 54, 62, .38), transparent 40%),
            linear-gradient(122deg, #08151c 0%, #101c21 46%, #111a1d 100%);
        }
        .aeon-field__depth {
          position: absolute;
          inset: -15%;
          opacity: .48;
          background:
            radial-gradient(ellipse at 75% 50%, transparent 0 20%, rgba(211, 174, 132, .04) 20.1% 20.2%, transparent 20.4% 28%, rgba(211, 174, 132, .035) 28.1% 28.2%, transparent 28.4% 36%, rgba(211, 174, 132, .025) 36.1% 36.2%, transparent 36.4%),
            linear-gradient(90deg, rgba(8, 21, 28, .4), transparent 58%);
          animation: aeon-breathe 24s ease-in-out infinite alternate;
        }
        .aeon-field__geometry {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: .8;
        }
        .aeon-field__veil {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(90deg, rgba(7, 18, 24, .38), transparent 30%, transparent 77%, rgba(7, 17, 21, .22));
        }
        @keyframes aeon-breathe {
          from { transform: scale(1) translate3d(0, 0, 0); }
          to { transform: scale(1.035) translate3d(-.4%, .25%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aeon-field__depth { animation: none; }
        }
      `}</style>
    </div>
  );
}

export function CyclicCosmos() {
  return <ComposerPreview backgroundLayer={<AeonField />} transparentCanvas />;
}

export default CyclicCosmos;
