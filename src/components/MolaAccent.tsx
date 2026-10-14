import React from 'react';

interface MolaAccentProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MolaAccent: React.FC<MolaAccentProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: { width: 36, height: 18 },
    md: { width: 54, height: 27 },
    lg: { width: 72, height: 36 },
  }[size];

  return (
    <span
      className={`inline-flex items-center shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 64 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-auto"
      >
        {/* Standardized Approved Mola Motif matching Homepage Header Frame */}
        {/* Left Angular Spiral - Forest Green (#173B32) & Gold (#B79A62) */}
        <path
          d="M 3,29 L 3,3 L 29,3 L 29,21 L 11,21 L 11,9 L 21,9 L 21,15 L 15,15"
          stroke="#173B32"
          strokeWidth="2.0"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Right Interlocking Angular Spiral - Deep Red (#A71920) & Warm Ochre (#D38B25) */}
        <path
          d="M 61,3 L 61,29 L 35,29 L 35,11 L 53,11 L 53,23 L 43,23 L 43,17 L 49,17"
          stroke="#A71920"
          strokeWidth="2.0"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />

        {/* Center Interlocking Link Line - Muted Gold (#B79A62) */}
        <line
          x1="29"
          y1="15"
          x2="35"
          y2="15"
          stroke="#B79A62"
          strokeWidth="2.0"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
};

