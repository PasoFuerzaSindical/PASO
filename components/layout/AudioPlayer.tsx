
import React from 'react';
import { useMusic } from '../../contexts/MusicContext';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '../ui/Button';
import Visualizer from '../ui/Visualizer';

const AudioPlayer: React.FC = () => {
  const { isPlaying, togglePlay, currentTrack, isMuted, setIsMuted } = useMusic();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-20 right-6 z-[100] md:bottom-6">
      <div className="bg-background/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center gap-3 shadow-2xl group transition-all hover:border-brand-green/30">
        <div className="flex flex-col items-end pr-2 border-r border-white/5">
          <span className="text-[8px] font-mono text-brand-green/60 uppercase tracking-widest">Signal.Active</span>
          <span className="text-[10px] font-bold truncate max-w-[120px] text-foreground/80">{currentTrack.title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-brand-red" /> : <Volume2 className="h-4 w-4 text-brand-green" />}
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-brand-green text-black hover:scale-110 transition-transform shadow-[0_0_15px_rgba(10,255,96,0.3)]" 
            onClick={togglePlay}
          >
            {isPlaying && !isMuted ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          </Button>
        </div>
        
        <div className="px-2">
          <Visualizer isPlaying={isPlaying && !isMuted} />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
