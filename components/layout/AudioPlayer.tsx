
import React from 'react';
import { useMusic } from '../../contexts/MusicContext';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import Visualizer from '../ui/Visualizer';
import { cn } from '../../lib/utils';

const AudioPlayer: React.FC = () => {
  const { isPlaying, togglePlay, currentTrack, isMuted, setIsMuted, error, hasInteracted, isLoading } = useMusic();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-20 right-6 z-[100] md:bottom-6">
      <div className={cn(
        "bg-background/80 backdrop-blur-xl border p-2 rounded-2xl flex items-center gap-3 shadow-2xl group transition-all duration-500 min-w-[200px]",
        error ? "border-brand-red/50 shadow-brand-red/10" : "border-white/10 hover:border-brand-green/30"
      )}>
        <div className="flex flex-col items-end pr-2 border-r border-white/5 min-w-[80px]">
          <span className={cn(
            "text-[8px] font-mono uppercase tracking-widest",
            error ? "text-brand-red" : "text-brand-green/60"
          )}>
            {isLoading ? 'Loading...' : (error ? 'Signal.Error' : (isPlaying && !isMuted ? 'Signal.Live' : 'Signal.Paused'))}
          </span>
          <span className="text-[10px] font-bold truncate max-w-[120px] text-foreground/80">
            {error ? error : currentTrack.title}
          </span>
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
            disabled={isLoading}
            className={cn(
              "h-10 w-10 rounded-full text-black transition-all shadow-lg active:scale-95",
              error ? "bg-brand-red" : "bg-brand-green hover:scale-110 shadow-brand-green/20"
            )} 
            onClick={togglePlay}
          >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                error ? <AlertCircle className="h-5 w-5" /> : (isPlaying && !isMuted ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-1" />)
            )}
          </Button>
        </div>
        
        <div className="px-2">
          <Visualizer isPlaying={isPlaying && !isMuted && !error && !isLoading} />
        </div>

        {!hasInteracted && !error && (
          <div className="absolute -top-12 right-0 bg-brand-green text-black text-[10px] font-black px-3 py-1 rounded-full animate-bounce uppercase tracking-tighter shadow-xl">
            Sintonizar Audio
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
