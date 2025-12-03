
import React from 'react';
import { cn } from '../../lib/utils';

interface HeartbeatProps {
    className?: string;
    color?: string;
}

const Heartbeat: React.FC<HeartbeatProps> = ({ className, color = "#16a34a" }) => {
  return (
    <div className={cn("w-full h-24 overflow-hidden relative flex items-center opacity-50 pointer-events-none", className)}>
      <svg
        viewBox="0 0 500 100"
        className="w-full h-full absolute inset-0"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 L20,50 L30,20 L40,80 L50,50 L100,50 L110,50 L120,20 L130,80 L140,50 L250,50 L260,50 L270,10 L280,90 L290,50 L400,50 L410,50 L420,20 L430,80 L440,50 L500,50"
          fill="none"
          stroke={color}
          strokeWidth="2"
          className="animate-heartbeat"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10"></div>
    </div>
  );
};

export default Heartbeat;
