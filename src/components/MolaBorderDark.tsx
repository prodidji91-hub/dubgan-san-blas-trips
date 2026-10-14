import React from 'react';

export const MolaBorderDark: React.FC = () => {
  return (
    <div
      className="w-full bg-[#142B42] relative overflow-hidden select-none py-0.5 border-y border-[#B79A62]/60 shadow-lg z-20"
      aria-hidden="true"
    >
      {/* 
        MolaBorderDark: Repeating Angular Rectangular Spiral Motif
        Standardized to match the approved homepage Header Mola frame color language & stroke styling.
        Colors: Gold (#B79A62), Forest Green (#173B32), Deep Red (#A71920), Warm Ochre (#D38B25)
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
              {/* Deep Navy Textile Background (#142B42) */}
              <rect width="120" height="60" fill="#142B42" />

              {/* MOTIF 1: Outer Angular Rectangular Spiral - Deep Red (#A71920) */}
              <path
                d="M 5,55 L 5,5 L 55,5 L 55,43 L 17,43 L 17,17 L 43,17 L 43,31 L 29,31 L 29,23 L 35,23"
                stroke="#A71920"
                strokeWidth="2.2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              {/* MOTIF 2: Interlocking Opposite Rectangular Spiral - Warm Ochre (#D38B25) */}
              <path
                d="M 115,5 L 115,55 L 65,55 L 65,17 L 103,17 L 103,43 L 77,43 L 77,29 L 91,29 L 91,37 L 85,37"
                stroke="#D38B25"
                strokeWidth="2.2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              {/* Inner Nested Accent Spiral - Forest Green (#173B32) */}
              <path
                d="M 11,49 L 11,11 L 49,11 L 49,37 L 23,37 L 23,23 L 37,23"
                stroke="#173B32"
                strokeWidth="1.6"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              <path
                d="M 109,11 L 109,49 L 71,49 L 71,23 L 97,23 L 97,37 L 83,37"
                stroke="#173B32"
                strokeWidth="1.6"
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
                stroke="#173B32"
                strokeWidth="2.2"
                strokeLinecap="square"
              />
              <line
                x1="0"
                y1="30"
                x2="5"
                y2="30"
                stroke="#B79A62"
                strokeWidth="2.2"
                strokeLinecap="square"
              />
              <line
                x1="115"
                y1="30"
                x2="120"
                y2="30"
                stroke="#B79A62"
                strokeWidth="2.2"
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
