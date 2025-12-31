
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
// Added Info to the imports from lucide-react
import { Radio, Plus, Trash2, Save, Music, Link, UploadCloud, CheckCircle2, AlertCircle, Play, Pause, FileAudio, Info } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { CampaignPhase } from '../lib/campaignGems';
import { cn } from '../lib/utils';
import Loader from '../components/Loader';

const RadioAdminPage: React.FC = () => {
  const { playlists, updatePlaylist } = useMusic();
  const [activePhase, setActivePhase] = useState<CampaignPhase>('Llegada');
  const [isConverting, setIsConverting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTracks = playlists[activePhase] || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsConverting(true);
      try {
          const reader = new FileReader();
          reader.onload = (event) => {
              const base64 = event.target?.result as string;
              const newTrack = { 
                  title: file.name.replace(/\.[^/.]+$/, ""), 
                  url: base64 // Se guarda directamente como data:audio/...;base64,...
              };
              updatePlaylist(activePhase, [...currentTracks, newTrack]);
              setIsConverting(false);
          };
          reader.readAsDataURL(file);
      } catch (err) {
          console.error("Error al procesar audio:", err);
          alert("Error al inyectar el audio en el código.");
          setIsConverting(false);
      }
  };

  const handleUpdateTrack = (index: number, field: 'title' | 'url', value: string) => {
    const newTracks = [...currentTracks];
    newTracks[index] = { ...newTracks[index], [field]: value };
    updatePlaylist(activePhase, newTracks);
  };

  const handleRemoveTrack = (index: number) => {
    const newTracks = currentTracks.filter((_, i) => i !== index);
    updatePlaylist(activePhase, newTracks);
  };

  const isBase64 = (url: string) => url.startsWith('data:audio');

  return (
    <div className="container mx-auto max-w-4xl space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-green/10 rounded-2xl border border-brand-green/20">
              <Radio className="h-8 w-8 text-brand-green animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">Consola de Frecuencias</h1>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Inyección directa de audio en el código.</p>
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

      <Card className="border-brand-green/30 overflow-hidden">
        <CardHeader className="bg-secondary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl italic">
              <Music className="h-5 w-5 text-brand-green" />
              Playlist: <span className="text-brand-green">{activePhase.toUpperCase()}</span>
            </CardTitle>
            <div className="flex gap-2">
                <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="audio/*" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                />
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-brand-green/30 text-brand-green h-8"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isConverting}
                >
                    {isConverting ? <Loader text="" /> : <><UploadCloud className="h-4 w-4 mr-2" /> Inyectar MP3</>}
                </Button>
            </div>
          </div>
          <CardDescription>
            Los archivos inyectados se guardan localmente. No dependen de Drive ni de internet.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {currentTracks.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl">
                  <p className="text-muted-foreground italic text-sm">No hay señales grabadas en esta fase.</p>
              </div>
          ) : (
            currentTracks.map((track, index) => (
              <div key={index} className="flex flex-col gap-4 p-5 bg-secondary/30 rounded-2xl border border-white/5 relative group transition-all hover:border-brand-green/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-brand-green tracking-widest">Título de la Señal</Label>
                    <Input 
                      value={track.title} 
                      onChange={(e) => handleUpdateTrack(index, 'title', e.target.value)} 
                      placeholder="Ej: Mensaje del Estratega"
                      className="bg-black/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-brand-green tracking-widest flex items-center justify-between">
                      <span>Origen de Datos</span>
                      {isBase64(track.url) 
                          ? <span className="text-[8px] text-brand-green flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Inyectado Local</span>
                          : <span className="text-[8px] text-blue-400 flex items-center gap-1"><Link className="h-3 w-3" /> Enlace Externo</span>
                      }
                    </Label>
                    <div className="flex gap-2">
                      <Input 
                          value={isBase64(track.url) ? "--- DATOS BINARIOS INYECTADOS ---" : track.url} 
                          onChange={(e) => handleUpdateTrack(index, 'url', e.target.value)} 
                          placeholder="URL o inyecta un archivo"
                          className="flex-1 bg-black/20 text-xs font-mono"
                          readOnly={isBase64(track.url)}
                      />
                      <Button 
                          variant="secondary" 
                          size="icon" 
                          className="shrink-0" 
                          onClick={() => handleRemoveTrack(index)}
                      >
                          <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>

        <CardFooter className="flex justify-between gap-4 border-t border-white/5 pt-6 bg-secondary/5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileAudio className="h-4 w-4" /> {currentTracks.length} pistas en memoria
          </div>
          <Button onClick={() => {setSuccess(true); setTimeout(() => setSuccess(false), 2000)}} className="bg-brand-green text-black font-black uppercase px-8">
            <Save className="h-4 w-4 mr-2" /> {success ? 'Sincronizado' : 'Guardar Frecuencias'}
          </Button>
        </CardFooter>
      </Card>

      <div className="bg-brand-green/5 border border-brand-green/20 p-6 rounded-3xl flex gap-4">
          {/* Added missing Info icon component here */}
          <Info className="h-6 w-6 text-brand-green shrink-0" />
          <div className="text-xs space-y-2">
              <p className="font-black text-brand-green uppercase tracking-tighter">Cómo usar la Inyección Directa:</p>
              <p className="text-muted-foreground leading-relaxed">
                  1. Pulsa <strong className="text-foreground">"Inyectar MP3"</strong> y selecciona un audio de tu ordenador.<br/>
                  2. El sistema lo convertirá en texto (Base64) y lo guardará en el almacenamiento del navegador.<br/>
                  3. <strong className="text-brand-green">Ventaja:</strong> Sonará siempre, sin fallos de CORS ni permisos de Drive. <br/>
                  4. <strong className="text-brand-red">Aviso:</strong> Si el archivo es muy grande, la página podría volverse pesada. Recomendamos archivos de menos de 10MB.
              </p>
          </div>
      </div>
    </div>
  );
};

export default RadioAdminPage;
