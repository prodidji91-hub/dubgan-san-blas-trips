import React from 'react';

export const MolaBorderDark: React.FC = () => {
  return (
    <div
      className="w-full bg-[#0A1C23] relative overflow-hidden select-none py-0.5 border-y border-[#B79A62]/60 shadow-lg z-20"
      aria-hidden="true"
    >
      {/* 
        MolaBorderDark: Repeating Angular Rectangular Spiral Motif
        Desktop height: ~50-60px, Mobile height: ~28-32px
        Features crisp 90-degree turns and open interlocking rectangular spirals
        Colors: Muted Gold (#B79A62), Coral/Terracotta (#D96848), Turquoise (#397D80), Deep Red (#C23B22), Navy (#0A1C23)
      */}
      <div className="h-[28px] sm:h-[45px] md:h-[58px] w-full flex items-center">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1600 60"
        >
          <defs>
            {/* Seamless Repeating Angular Rectangular Spiral Pattern */}
            <pattern
              id="molaDarkRectPattern"
              x="0"
              y="0"
              width="120"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* Deep Navy Textile Background */}
              <rect width="120" height="60" fill="#0A1C23" />

              {/* MOTIF 1: Outer Angular Rectangular Spiral - Muted Gold (#B79A62) */}
              <path
                d="M 5,55 L 5,5 L 55,5 L 55,43 L 17,43 L 17,17 L 43,17 L 43,31 L 29,31 L 29,23 L 35,23"
                stroke="#B79A62"
                strokeWidth="2.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              {/* MOTIF 2: Interlocking Opposite Rectangular Spiral - Coral / Terracotta (#D96848) */}
              <path
                d="M 115,5 L 115,55 L 65,55 L 65,17 L 103,17 L 103,43 L 77,43 L 77,29 L 91,29 L 91,37 L 85,37"
                stroke="#D96848"
                strokeWidth="2.5"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              {/* Inner Nested Accent Spiral - Turquoise (#397D80) */}
              <path
                d="M 11,49 L 11,11 L 49,11 L 49,37 L 23,37 L 23,23 L 37,23"
                stroke="#397D80"
                strokeWidth="1.8"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              <path
                d="M 109,11 L 109,49 L 71,49 L 71,23 L 97,23 L 97,37 L 83,37"
                stroke="#397D80"
                strokeWidth="1.8"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              {/* Interlocking Connection Line between Motifs */}
              <line
                x1="55"
                y1="30"
                x2="65"
                y2="30"
                stroke="#D49A3A"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <line
                x1="0"
                y1="30"
                x2="5"
                y2="30"
                stroke="#D49A3A"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
              <line
                x1="115"
                y1="30"
                x2="120"
                y2="30"
                stroke="#D49A3A"
                strokeWidth="2.5"
                strokeLinecap="square"
              />
            </pattern>
          </defs>

          {/* Full-width Seamless Render */}
          <rect width="100%" height="60" fill="url(#molaDarkRectPattern)" />
        </svg>
      </div>

      {/* Top & Bottom Fine Gold Framing Lines */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-[#B79A62] opacity-80" />
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#B79A62] opacity-80" />
    </div>
  );
};
