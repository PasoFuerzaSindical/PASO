
import React, { useState, useEffect } from 'react';
import { useMusic } from '../../contexts/MusicContext';
import { Radio, Wifi, Zap } from 'lucide-react';
import { Button } from './Button';
import Logo from './Logo';

const WelcomeAudioModal: React.FC = () => {
  const { hasInteracted, setHasInteracted, togglePlay } = useMusic();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar si no ha habido interacción previa en esta sesión
    if (!hasInteracted) {
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  if (!isVisible || hasInteracted) return null;

  const handleTuneIn = () => {
    setHasInteracted(true);
    togglePlay(); // Esto activa el audio inmediatamente tras el clic
  };

  return (
    <div className="fixed inset-0 z-[200] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,255,96,0.1),transparent_70%)]"></div>
      
      <div className="max-w-md w-full bg-black/40 border border-brand-green/30 p-8 rounded-3xl shadow-[0_0_50px_rgba(10,255,96,0.1)] relative overflow-hidden flex flex-col items-center text-center space-y-6">
        <div className="w-24 h-24 mb-2">
          <Logo />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-black italic tracking-tighter text-brand-green uppercase">Señal Detectada</h2>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest leading-relaxed">
            Hemos interceptado una transmisión de la red P.A.S.O. 
            Sintoniza para recibir los protocolos de la campaña.
          </p>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-green/20 to-transparent"></div>

        <div className="flex flex-col gap-4 w-full">
          <Button 
            onClick={handleTuneIn}
            className="h-16 bg-brand-green text-black font-black text-xl italic uppercase hover:scale-105 transition-all shadow-[0_0_30px_rgba(10,255,96,0.3)] group"
          >
            <Radio className="mr-3 h-6 w-6 animate-pulse" /> Sintonizar Frecuencia
          </Button>
          
          <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground/60 uppercase">
             <span className="flex items-center gap-1"><Wifi className="h-3 w-3" /> Transmisión Segura</span>
             <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Audio Activo</span>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 border-t border-l border-brand-green/40 w-4 h-4"></div>
        <div className="absolute top-4 right-4 border-t border-r border-brand-green/40 w-4 h-4"></div>
        <div className="absolute bottom-4 left-4 border-b border-l border-brand-green/40 w-4 h-4"></div>
        <div className="absolute bottom-4 right-4 border-b border-r border-brand-green/40 w-4 h-4"></div>
      </div>
    </div>
  );
};

export default WelcomeAudioModal;
