
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
    { title: "Transmisión P.A.S.O. 01", url: "https://drive.google.com/uc?export=download&id=1HKn8vcS2kH5LcYOsQF8WpyCwx4E6iqlL" },
    { title: "Transmisión P.A.S.O. 02", url: "https://drive.google.com/uc?export=download&id=1nT2iiVSe_GLeGeYD8l-agiHYCpSF73pd" }
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

  // Inicialización del elemento de audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // No usamos crossOrigin para evitar problemas con Drive si no hay cabeceras CORS
    }
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % (currentPlaylist.length || 1));
    };

    const handleLoadStart = () => {
        setIsLoading(true);
        setError(null);
    };

    const handleCanPlay = () => {
        setIsLoading(false);
        setError(null);
    };

    const handleAudioError = () => {
        setIsLoading(false);
        const err = audio.error;
        if (err) {
            // Corregimos el log para evitar [object Object]
            const errorMsg = `Audio Error (Code ${err.code}): ${err.message || 'Source not supported'}`;
            console.error(errorMsg);
            
            if (err.code === 4) setError("Señal bloqueada: ¿Drive es público?");
            else if (err.code === 2) setError("Fallo de red: Sin conexión");
            else setError(`Error ${err.code}: Fallo de señal`);
        } else {
            setError("Error desconocido en la frecuencia");
        }
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

  // Manejo de cambio de pista (Fuente)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      const targetUrl = currentTrack.url;
      // Solo cargamos si la URL es realmente distinta
      if (audio.src !== targetUrl) {
          setError(null);
          audio.src = targetUrl;
          audio.load();
      }
    }
  }, [currentTrack]);

  // Manejo de Play/Pause/Mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    if (isPlaying && hasInteracted && !isMuted) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn("Reproducción diferida:", e.message);
          // No seteamos error aquí porque puede ser solo un bloqueo de autoplay temporal
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, isMuted, volume, hasInteracted]);

  // Resetear al cambiar de fase
  useEffect(() => {
    setCurrentTrackIndex(0);
    setError(null);
  }, [campaignPhase]);

  const togglePlay = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsMuted(false);
    setIsPlaying(prev => !prev);
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
