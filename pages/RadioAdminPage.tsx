
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Radio, Plus, Trash2, Save, Music } from 'lucide-react';
import { useMusic } from '../contexts/MusicContext';
import { CampaignPhase } from '../lib/campaignGems';

const RadioAdminPage: React.FC = () => {
  const { playlists, updatePlaylist } = useMusic();
  const [activePhase, setActivePhase] = useState<CampaignPhase>('Llegada');
  const [success, setSuccess] = useState(false);

  const currentTracks = playlists[activePhase] || [];

  const handleAddTrack = () => {
    const newTrack = { title: "Nueva Transmisión", url: "" };
    updatePlaylist(activePhase, [...currentTracks, newTrack]);
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

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-brand-green/10 rounded-2xl border border-brand-green/20">
          <Radio className="h-8 w-8 text-brand-green animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Consola de Frecuencias</h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Gestión de la banda sonora de la campaña</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {(['Llegada', 'Observacion', 'Abduccion', 'Revelacion'] as CampaignPhase[]).map(phase => (
          <Button 
            key={phase} 
            variant={activePhase === phase ? 'default' : 'outline'}
            onClick={() => setActivePhase(phase)}
            className="text-xs uppercase font-black"
          >
            {phase}
          </Button>
        ))}
      </div>

      <Card className="border-brand-green/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-brand-green" />
            Playlist: Fase {activePhase}
          </CardTitle>
          <CardDescription>
            Pega enlaces directos a archivos MP3. Los usuarios los escucharán automáticamente en esta fase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentTracks.map((track, index) => (
            <div key={index} className="flex flex-col gap-2 p-4 bg-secondary/30 rounded-xl border border-white/5 relative group">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Título</Label>
                  <Input 
                    value={track.title} 
                    onChange={(e) => handleUpdateTrack(index, 'title', e.target.value)} 
                    placeholder="Nombre de la pista"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">URL MP3</Label>
                  <Input 
                    value={track.url} 
                    onChange={(e) => handleUpdateTrack(index, 'url', e.target.value)} 
                    placeholder="https://servidor.com/musica.mp3"
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute -top-2 -right-2 bg-destructive text-white h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveTrack(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {currentTracks.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl">
              <p className="text-muted-foreground text-sm italic">No hay pistas configuradas para esta fase.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleAddTrack}>
            <Plus className="h-4 w-4 mr-2" /> Añadir Pista
          </Button>
          <Button onClick={() => {setSuccess(true); setTimeout(() => setSuccess(false), 2000)}} className="bg-brand-green text-black font-bold">
            <Save className="h-4 w-4 mr-2" /> {success ? 'Guardado' : 'Confirmar Cambios'}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="bg-brand-red/10 border border-brand-red/20 p-4 rounded-xl flex gap-4 items-start">
        <div className="p-2 bg-brand-red/20 rounded-lg text-brand-red">
          <Radio className="h-5 w-5" />
        </div>
        <div className="text-xs space-y-1">
          <p className="font-bold text-brand-red uppercase">Aviso de Compatibilidad</p>
          <p className="text-muted-foreground leading-relaxed">
            Para que la música funcione, asegúrate de que los enlaces terminen en <span className="text-foreground">.mp3</span> o sean enlaces directos de audio. Si usas Google Drive, debes usar el enlace de descarga directa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadioAdminPage;
