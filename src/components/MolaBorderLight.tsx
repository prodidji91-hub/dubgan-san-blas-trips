import React from 'react';

export const MolaBorderLight: React.FC = () => {
  return (
    <div
      className="w-full bg-[#F6F2E9] relative overflow-hidden select-none py-0.5 border-y border-[#B79A62]/40 z-20"
      aria-hidden="true"
    >
      {/* 
        MolaBorderLight: Delicate Angular Rectangular Spiral Band
        Standardized to match the approved homepage Header Mola frame color language & stroke styling.
        Colors: Gold (#B79A62), Forest Green (#173B32), Deep Red (#A71920), Warm Ochre (#D38B25)
      */}
      <div className="h-[16px] sm:h-[22px] md:h-[28px] w-full flex items-center">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1600 28"
        >
          <defs>
            <pattern
              id="molaLightRectPattern"
              x="0"
              y="0"
              width="70"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              {/* Warm Ivory Background */}
              <rect width="70" height="28" fill="#F6F2E9" />

              {/* MOTIF 1: Primary Forest Green Angular Rectangular Spiral (#173B32) */}
              <path
                d="M 3,25 L 3,3 L 31,3 L 31,20 L 10,20 L 10,9 L 24,9 L 24,15 L 17,15"
                stroke="#173B32"
                strokeWidth="1.6"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              {/* MOTIF 2: Interlocking Deep Red Rectangular Spiral (#A71920) */}
              <path
                d="M 67,3 L 67,25 L 39,25 L 39,8 L 60,8 L 60,19 L 46,19 L 46,13 L 53,13"
                stroke="#A71920"
                strokeWidth="1.6"
                strokeLinecap="square"
                strokeLinejoin="miter"
                fill="none"
              />

              {/* Connecting Warm Ochre / Gold Accent Link (#D38B25 / #B79A62) */}
              <line
                x1="31"
                y1="14"
                x2="39"
                y2="14"
                stroke="#D38B25"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
              <line
                x1="0"
                y1="14"
                x2="3"
                y2="14"
                stroke="#B79A62"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
              <line
                x1="67"
                y1="14"
                x2="70"
                y2="14"
                stroke="#B79A62"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </pattern>
          </defs>

          <rect width="100%" height="28" fill="url(#molaLightRectPattern)" />
        </svg>
      </div>

      {/* Top & Bottom Thin Gold Framing Lines */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-[#B79A62] opacity-70" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-[#B79A62] opacity-70" />
    </div>
  );
};
