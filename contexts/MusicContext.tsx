
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useCampaign } from './CampaignContext';
import useLocalStorage from '../hooks/useLocalStorage';

interface Track {
  url: string;
  title: string;
}

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  currentTrack: Track | null;
  volume: number;
  setVolume: (v: number) => void;
  playlists: Record<string, Track[]>;
  updatePlaylist: (phase: string, tracks: Track[]) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
  hasInteracted: boolean;
  setHasInteracted: (v: boolean) => void;
  error: string | null;
  isLoading: boolean;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const DEFAULT_PLAYLISTS: Record<string, Track[]> = {
  Llegada: [
    { title: "Señal Estelar", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Viento Solar", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
  ],
  Observacion: [
    { title: "Escáner de Campo", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
  ],
  Abduccion: [
    { title: "Frecuencia Crítica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
  ],
  Revelacion: [
    { title: "El Himno del Cambio", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" }
  ]
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { campaignPhase } = useCampaign();
  const [playlists, setPlaylists] = useLocalStorage<Record<string, Track[]>>('paso-playlists', DEFAULT_PLAYLISTS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentPlaylist = playlists[campaignPhase] || [];
  const currentTrack = currentPlaylist[currentTrackIndex] || null;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous"; // Intentar evitar problemas de CORS
    }
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % currentPlaylist.length);
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
        setIsLoading(false);
        setError(null);
    };
    const handleAudioError = (e: any) => {
        setIsLoading(false);
        const errorCode = audio.error?.code;
        if (errorCode === 4) setError("Formato no soportado o Link roto");
        else if (errorCode === 3) setError("Error de decodificación");
        else if (errorCode === 2) setError("Error de red");
        else if (errorCode === 1) setError("Carga abortada");
        else setError("Error de acceso (¿Es público el Drive?)");
        console.error("Audio Engine Error:", audio.error);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleAudioError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleAudioError);
    };
  }, [currentPlaylist]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      setError(null);
      audioRef.current.src = currentTrack.url;
      audioRef.current.load();
      
      if (isPlaying && !isMuted && hasInteracted) {
        audioRef.current.play().catch(() => {
          // Si falla aquí suele ser por falta de interacción del usuario
        });
      }
    }
  }, [currentTrack, hasInteracted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;

      if (isPlaying && !isMuted && hasInteracted) {
        audioRef.current.play().catch(e => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, volume, hasInteracted]);

  useEffect(() => {
    setCurrentTrackIndex(0);
  }, [campaignPhase]);

  const togglePlay = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsMuted(false);
    setIsPlaying(!isPlaying);
  };

  const updatePlaylist = (phase: string, newTracks: Track[]) => {
    setPlaylists(prev => ({ ...prev, [phase]: newTracks }));
  };

  return (
    <MusicContext.Provider value={{ 
      isPlaying, togglePlay, currentTrack, volume, setVolume, 
      playlists, updatePlaylist, isMuted, setIsMuted,
      hasInteracted, setHasInteracted, error, isLoading
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};
