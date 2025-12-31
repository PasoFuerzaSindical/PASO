
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
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentPlaylist = playlists[campaignPhase] || [];
  const currentTrack = currentPlaylist[currentTrackIndex] || null;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    audio.loop = false;
    audio.volume = isMuted ? 0 : volume;

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % currentPlaylist.length);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentPlaylist, volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.url;
      if (wasPlaying && !isMuted) {
        audioRef.current.play().catch(e => console.log("Autoplay blocked by browser"));
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(e => console.log("Interacción requerida"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, volume]);

  // Cambiar playlist al cambiar de fase
  useEffect(() => {
    setCurrentTrackIndex(0);
  }, [campaignPhase]);

  const togglePlay = () => {
    if (isMuted) setIsMuted(false);
    setIsPlaying(!isPlaying);
  };

  const updatePlaylist = (phase: string, newTracks: Track[]) => {
    setPlaylists(prev => ({ ...prev, [phase]: newTracks }));
  };

  return (
    <MusicContext.Provider value={{ 
      isPlaying, togglePlay, currentTrack, volume, setVolume, 
      playlists, updatePlaylist, isMuted, setIsMuted 
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
