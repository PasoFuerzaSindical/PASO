
import React from 'react';
import { cn } from '../../lib/utils';

const Visualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className="flex items-end gap-[2px] h-4 w-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={cn(
            "w-1 bg-brand-green rounded-full transition-all duration-300",
            isPlaying ? "animate-bounce" : "h-1"
          )}
          style={{
            animationDuration: `${0.5 + i * 0.2}s`,
            height: isPlaying ? `${Math.random() * 100}%` : '4px'
          }}
        />
      ))}
    </div>
  );
};

export default Visualizer;
