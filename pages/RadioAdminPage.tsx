
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Radio, Plus, Trash2, Save, Music, Link, Info, CheckCircle2, AlertCircle, Wand2, ExternalLink, PlayCircle } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { CampaignPhase } from '../lib/campaignGems';
import { cn } from '../lib/utils';

const RadioAdminPage: React.FC = () => {
  const { playlists, updatePlaylist } = useMusic();
  const [activePhase, setActivePhase] = useState<CampaignPhase>('Llegada');
  const [success, setSuccess] = useState(false);

  const currentTracks = playlists[activePhase] || [];

  const convertToDirectLink = (url: string): string => {
    let converted = url.trim();
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const driveMatch = converted.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }
    if (converted.includes('dropbox.com')) {
      return converted.replace('dl=0', 'raw=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }
    return converted;
  };

  const handleAddTrack = () => {
    const newTrack = { title: "Nueva Transmisión", url: "" };
    updatePlaylist(activePhase, [...currentTracks, newTrack]);
  };

  const handleUpdateTrack = (index: number, field: 'title' | 'url', value: string) => {
    const newTracks = [...currentTracks];
    let finalValue = value;
    if (field === 'url' && value.startsWith('http')) {
        finalValue = convertToDirectLink(value);
    }
    newTracks[index] = { ...newTracks[index], [field]: finalValue };
    updatePlaylist(activePhase, newTracks);
  };

  const handleRemoveTrack = (index: number) => {
    const newTracks = currentTracks.filter((_, i) => i !== index);
    updatePlaylist(activePhase, newTracks);
  };

  const isValidAudioLink = (url: string) => {
      return url.includes('uc?export=download') || url.includes('raw=1') || url.endsWith('.mp3') || url.endsWith('.wav');
  };

  const testLink = (url: string) => {
      if (!url) return;
      window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-green/10 rounded-2xl border border-brand-green/20">
              <Radio className="h-8 w-8 text-brand-green animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">Consola de Frecuencias</h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Master de la "Radio Pirata" P.A.S.O.</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {(['Llegada', 'Observacion', 'Abduccion', 'Revelacion'] as CampaignPhase[]).map(phase => (
          <Button 
            key={phase} 
            variant={activePhase === phase ? 'default' : 'outline'}
            onClick={() => setActivePhase(phase)}
            className={cn(
                "text-xs uppercase font-black h-12 border-white/5 transition-all",
                activePhase === phase ? "bg-brand-green text-black scale-105 shadow-[0_0_20px_rgba(10,255,96,0.3)]" : "hover:bg-brand-green/10"
            )}
          >
            {phase}
          </Button>
        ))}
      </div>

      <Card className="border-brand-green/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl italic">
            <Music className="h-5 w-5 text-brand-green" />
            Playlist: <span className="text-brand-green">{activePhase.toUpperCase()}</span>
          </CardTitle>
          <CardDescription>
            Si un enlace no suena, usa el botón de "Probar" para ver si Drive te pide acceso.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentTracks.map((track, index) => (
            <div key={index} className="flex flex-col gap-4 p-5 bg-secondary/30 rounded-2xl border border-white/5 relative group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-brand-green tracking-widest">Título</Label>
                  <Input 
                    value={track.title} 
                    onChange={(e) => handleUpdateTrack(index, 'title', e.target.value)} 
                    placeholder="Ej: Himno de la Resistencia"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-brand-green tracking-widest flex items-center justify-between">
                    <span>URL del Archivo</span>
                    {track.url && (
                        isValidAudioLink(track.url) 
                        ? <span className="text-[8px] text-brand-green flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Convertido</span>
                        : <span className="text-[8px] text-brand-red flex items-center gap-1"><AlertCircle className="h-3 w-3" /> No soportado</span>
                    )}
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                        value={track.url} 
                        onChange={(e) => handleUpdateTrack(index, 'url', e.target.value)} 
                        placeholder="Enlace de Drive"
                        className="flex-1"
                    />
                    <Button 
                        variant="secondary" 
                        size="icon" 
                        className="shrink-0" 
                        title="Probar si el enlace es público"
                        onClick={() => testLink(track.url)}
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -top-2 -right-2 bg-destructive text-white h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                onClick={() => handleRemoveTrack(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-between gap-4 border-t border-white/5 pt-6">
          <Button variant="outline" onClick={handleAddTrack} className="border-brand-green/30 text-brand-green">
            <Plus className="h-4 w-4 mr-2" /> Añadir Pista
          </Button>
          <Button onClick={() => {setSuccess(true); setTimeout(() => setSuccess(false), 2000)}} className="bg-brand-green text-black font-black uppercase">
            <Save className="h-4 w-4 mr-2" /> {success ? 'Guardado' : 'Guardar Cambios'}
          </Button>
        </CardFooter>
      </Card>

      <div className="bg-brand-red/10 border border-brand-red/20 p-5 rounded-2xl flex gap-4">
          <AlertCircle className="h-6 w-6 text-brand-red shrink-0" />
          <div className="text-xs space-y-2">
              <p className="font-black text-brand-red uppercase">¿Por qué no suena mi música?</p>
              <p className="text-muted-foreground leading-relaxed">
                  1. <strong>Privacidad:</strong> En Google Drive, haz clic en "Compartir" y asegúrate de que diga <span className="text-foreground font-bold">"Cualquier persona con el enlace"</span>. Si está en "Restringido", la app no podrá leerlo.<br/>
                  2. <strong>Tamaño:</strong> Google Drive bloquea la descarga directa automática si el archivo es muy grande (>100MB) para escanear virus. Intenta usar MP3 de menos de 20MB.
              </p>
          </div>
      </div>
    </div>
  );
};

export default RadioAdminPage;
