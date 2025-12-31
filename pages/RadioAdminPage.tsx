
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Radio, Plus, Trash2, Save, Music, Link, Info, CheckCircle2, AlertCircle, Wand2 } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { CampaignPhase } from '../lib/campaignGems';
import { cn } from '../lib/utils';

const RadioAdminPage: React.FC = () => {
  const { playlists, updatePlaylist } = useMusic();
  const [activePhase, setActivePhase] = useState<CampaignPhase>('Llegada');
  const [success, setSuccess] = useState(false);

  const currentTracks = playlists[activePhase] || [];

  // Función mágica para convertir enlaces de Drive/Dropbox a descarga directa
  const convertToDirectLink = (url: string): string => {
    let converted = url.trim();
    
    // Google Drive: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const driveMatch = converted.match(driveRegex);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`;
    }

    // Dropbox: https://www.dropbox.com/s/xyz/file.mp3?dl=0
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
    
    // Si el usuario pega una URL, intentamos convertirla automáticamente
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

  return (
    <div className="container mx-auto max-w-4xl space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-green/10 rounded-2xl border border-brand-green/20">
              <Radio className="h-8 w-8 text-brand-green animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">Consola de Frecuencias</h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Control maestro de la "Radio Pirata" P.A.S.O.</p>
            </div>
        </div>
        <div className="flex items-center gap-2 bg-secondary/30 p-2 rounded-xl border border-white/5">
            <Info className="h-4 w-4 text-brand-green" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Autoconversión Activa</span>
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

      <Card className="border-brand-green/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Music className="h-24 w-24" />
        </div>
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl italic">
            <Link className="h-5 w-5 text-brand-green" />
            Playlist: <span className="text-brand-green">{activePhase.toUpperCase()}</span>
          </CardTitle>
          <CardDescription>
            Pega el enlace de "Compartir" de Google Drive o Dropbox. La app lo convertirá a un enlace de reproducción directa automáticamente.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {currentTracks.map((track, index) => (
            <div key={index} className="flex flex-col gap-4 p-5 bg-secondary/30 rounded-2xl border border-white/5 relative group hover:border-brand-green/20 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-brand-green tracking-widest flex items-center gap-1">
                    <Music className="h-3 w-3" /> Título de la Pista
                  </Label>
                  <Input 
                    value={track.title} 
                    onChange={(e) => handleUpdateTrack(index, 'title', e.target.value)} 
                    placeholder="Ej: Himno de la Resistencia"
                    className="bg-black/40 border-white/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-brand-green tracking-widest flex items-center justify-between">
                    <div className="flex items-center gap-1"><Wand2 className="h-3 w-3" /> URL del Archivo</div>
                    {track.url && (
                        isValidAudioLink(track.url) 
                        ? <span className="flex items-center gap-1 text-[8px] text-brand-green"><CheckCircle2 className="h-2 w-2"/> Válido</span>
                        : <span className="flex items-center gap-1 text-[8px] text-brand-red"><AlertCircle className="h-2 w-2"/> Revisar Link</span>
                    )}
                  </Label>
                  <div className="relative">
                    <Input 
                        value={track.url} 
                        onChange={(e) => handleUpdateTrack(index, 'url', e.target.value)} 
                        placeholder="Pega enlace de Drive o Dropbox aquí"
                        className={cn(
                            "bg-black/40 pr-10 border-white/10 transition-colors",
                            track.url && !isValidAudioLink(track.url) && "border-brand-red/50"
                        )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-30">
                        <Link className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -top-2 -right-2 bg-destructive text-white h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl"
                onClick={() => handleRemoveTrack(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {currentTracks.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-white/5 rounded-3xl bg-black/20">
              <Music className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm font-mono uppercase tracking-widest">Silencio absoluto en esta fase</p>
              <Button variant="link" onClick={handleAddTrack} className="text-brand-green mt-2 text-xs">Añadir primera pista</Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col md:flex-row justify-between gap-4 border-t border-white/5 pt-6">
          <Button variant="outline" onClick={handleAddTrack} className="w-full md:w-auto border-brand-green/30 text-brand-green hover:bg-brand-green/10">
            <Plus className="h-4 w-4 mr-2" /> Añadir Nueva Pista
          </Button>
          <Button 
            onClick={() => {setSuccess(true); setTimeout(() => setSuccess(false), 2000)}} 
            className="w-full md:w-auto bg-brand-green text-black font-black uppercase shadow-[0_0_20px_rgba(10,255,96,0.2)]"
          >
            <Save className="h-4 w-4 mr-2" /> {success ? 'Frecuencias Guardadas' : 'Confirmar Cambios'}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Guía de Ayuda Rápida */}
      <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-secondary/20 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-brand-green font-black text-xs uppercase tracking-widest mb-1">
                  <Radio className="h-4 w-4" /> Guía Google Drive
              </div>
              <ol className="text-[10px] text-muted-foreground space-y-1 list-decimal list-inside font-mono">
                  <li>Sube tu archivo .mp3 a Drive.</li>
                  <li>Click derecho > <span className="text-foreground">Compartir</span>.</li>
                  <li>Cambia acceso a <span className="text-foreground">"Cualquier persona con el enlace"</span>.</li>
                  <li>Copia el enlace y pégalo aquí arriba.</li>
              </ol>
          </div>

          <div className="bg-secondary/20 border border-white/5 p-4 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-brand-green font-black text-xs uppercase tracking-widest mb-1">
                  <Radio className="h-4 w-4" /> Guía Dropbox
              </div>
              <ol className="text-[10px] text-muted-foreground space-y-1 list-decimal list-inside font-mono">
                  <li>Sube tu archivo .mp3 a Dropbox.</li>
                  <li>Haz click en <span className="text-foreground">"Compartir"</span> y "Copiar enlace".</li>
                  <li>Asegúrate de que el enlace termine en <span className="text-foreground">dl=0</span>.</li>
                  <li>Pégalo aquí y nosotros lo cambiaremos a <span className="text-foreground">raw=1</span>.</li>
              </ol>
          </div>
      </div>
    </div>
  );
};

export default RadioAdminPage;
