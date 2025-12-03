
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

const CyberBackground: React.FC<{ className?: string }> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ev.clientX - rect.left,
          y: ev.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
    >
      {/* Base dark grid (barely visible) */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`, 
          backgroundSize: '50px 50px' 
        }}
      />

      {/* Highlighted Grid (revealed by mouse) */}
      <div 
        className="absolute inset-0 opacity-30 transition-opacity duration-300"
        style={{ 
          backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`, 
          backgroundSize: '50px 50px',
          maskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`,
          WebkitMaskImage: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent)`
        }}
      />
      
      {/* Spotlight Glow */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(22, 163, 74, 0.06), transparent 40%)`
        }}
      />
    </div>
  );
};

export default CyberBackground;
