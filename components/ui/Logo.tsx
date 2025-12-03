
import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, animated = true }) => {
  return (
    <div className={cn("relative flex items-center justify-center text-ugt-green", className)}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_10px_rgba(10,255,96,0.6)]"
      >
        {/* THE EYE (Center) */}
        <g className={cn("origin-center", animated && "animate-pulse")}>
             {/* Sclera/Shape */}
            <path 
                d="M100 135C125 135 160 115 175 100C160 85 125 65 100 65C75 65 40 85 25 100C40 115 75 135 100 135Z" 
                stroke="currentColor" 
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_5px_currentColor]"
            />
            {/* Iris/Pupil */}
            <circle cx="100" cy="100" r="22" fill="currentColor" />
            <circle cx="100" cy="100" r="8" fill="#050505" />
            <circle cx="108" cy="92" r="4" fill="white" opacity="0.8" />
        </g>

        {/* ORBITAL RINGS (Rotating) */}
        <g className={cn("origin-center", animated && "animate-[spin_10s_linear_infinite]")}>
            {/* Ring 1 */}
            <path 
                d="M100 25C141.421 25 175 58.5786 175 100C175 115 170 130 160 140" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round"
                className="opacity-80"
            />
             {/* Ring 2 */}
            <path 
                d="M100 175C58.5786 175 25 141.421 25 100C25 85 30 70 40 60" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round"
                className="opacity-80"
            />
            {/* Decorative Dots on Orbit */}
            <circle cx="100" cy="25" r="4" fill="currentColor" />
            <circle cx="100" cy="175" r="4" fill="currentColor" />
        </g>
        
        {/* Crosshair details for Tech look */}
        <path d="M100 10V20 M100 180V190 M10 100H20 M180 100H190" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      </svg>
    </div>
  );
};

export default Logo;
