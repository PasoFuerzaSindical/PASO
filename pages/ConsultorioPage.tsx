
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import Loader from '../components/Loader';
import { handleSurrealConsultation } from '../services/geminiService';
import { SurrealConsultationResult, SavedConsultation } from '../lib/types';
import { AlertTriangle, Mic, Square, Send } from 'lucide-react';
import { useCampaign } from '../contexts/CampaignContext';
import useLocalStorage from '../hooks/useLocalStorage';
import Typewriter from '../components/ui/Typewriter';
import { cn } from '../lib/utils';

const ConsultorioPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SurrealConsultationResult | null>(null);
  const { campaignPhase } = useCampaign();
  const [, setSavedConsultations] = useLocalStorage<SavedConsultation[]>('saved-consultations', []);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' }); // Browser typically records webm/ogg
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setResult(null);
      setError(null);
      setQuery('');
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("No se pudo acceder al micrófono. Comprueba los permisos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // remove data url prefix
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !audioBlob) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let inputData = query;
      let isAudio = false;

      if (audioBlob) {
        inputData = await blobToBase64(audioBlob);
        isAudio = true;
      }

      const response = await handleSurrealConsultation(inputData, campaignPhase, isAudio);
      setResult(response);

      // Clean up audio after success
      if (audioBlob) resetRecording();

      const newSavedConsultation: SavedConsultation = {
        id: new Date().toISOString(),
        query: isAudio ? "[Audio Message]" : query,
        responseText: response.text,
        responseImageB64: response.imageB64,
        createdAt: new Date().toISOString(),
      };
      setSavedConsultations(prev => [newSavedConsultation, ...prev]);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`El Oráculo está en su descanso para el café. (Detalles: ${errorMessage})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Consultorio Anónimo del Oráculo Sindical</CardTitle>
            <CardDescription>
              ¿Tu supervisor es un holograma? ¿Las grapadoras conspiran contra ti? Déjanos tu consulta. Puedes escribirla o grabarla (gritar es terapéutico).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Input Area Swapper */}
            {audioBlob ? (
              <div className="p-6 border-2 border-ugt-green rounded-md flex items-center justify-between bg-secondary/30 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-ugt-green flex items-center justify-center text-background font-bold">
                    <Mic className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-ugt-green">Audio Grabado</p>
                    <p className="text-xs text-muted-foreground">{recordingTime} segundos de desahogo</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" onClick={resetRecording} className="text-muted-foreground hover:text-destructive">
                  Cancelar
                </Button>
              </div>
            ) : isRecording ? (
              <div className="p-6 border-2 border-destructive rounded-md flex items-center justify-between bg-destructive/10">
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <div className="relative inline-flex rounded-full h-10 w-10 bg-destructive items-center justify-center">
                      <Mic className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-destructive">Grabando...</p>
                    <p className="text-xs text-muted-foreground font-mono">00:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}</p>
                  </div>
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={stopRecording}>
                  <Square className="h-4 w-4 mr-2 fill-current" /> Parar
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe tu desdicha aquí..."
                  rows={5}
                  disabled={loading}
                  className="pr-12"
                />
                <div className="absolute bottom-3 right-3">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="rounded-full h-10 w-10 hover:bg-destructive hover:text-white transition-colors"
                    onClick={startRecording}
                    title="Grabar audio"
                    disabled={loading}
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || (!query.trim() && !audioBlob)}>
              {loading ? <Loader text="Analizando ondas cerebrales..." /> : <><Send className="h-4 w-4 mr-2" /> Enviar al Oráculo</>}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Cósmico</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="border-ugt-green/30 overflow-hidden animate-fade-in">
          <CardHeader className="bg-secondary/20">
            <CardTitle className="text-ugt-green font-mono text-lg">Incoming Transmission...</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-4 min-h-[200px]">
              <Typewriter
                text={result.text}
                speed={20}
                className="text-sm leading-relaxed text-foreground/90"
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-ugt-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
              <img
                src={`data:image/jpeg;base64,${result.imageB64}`}
                alt="Representación conceptual surrealista"
                className="rounded-lg border border-ugt-green/30 shadow-lg w-full object-cover"
              />
              <p className="text-xs text-center mt-2 text-muted-foreground font-mono">fig.1: Interpretación visual del absurdo</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsultorioPage;
