
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/Card';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import Loader from '../components/Loader';
import { generateSocialPost } from '../services/geminiService';
import { CampaignPost } from '../lib/types';
import useLocalStorage from '../hooks/useLocalStorage';
import { Copy, RefreshCw, Save, FileText, Type, List } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { useCampaign } from '../contexts/CampaignContext';
import { CampaignPhase } from '../lib/campaignGems';


// Configure the workerSrc for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

type FormState = {
  platform: string;
  tone: string;
  theme: string;
};

const sacylTopics = [
    "Carrera Profesional",
    "Jornada de 35 horas semanales",
    "Listas de espera",
    "Falta de personal",
    "Contratos precarios y temporalidad",
    "Agresiones al personal sanitario",
    "Bolsa de empleo opaca",
    "Recortes en sanidad",
    "Salud mental del personal sanitario",
    "Atención Primaria saturada",
    "Falta de material y medios",
    "Desigualdad territorial en la asistencia",
    "Jubilación y relevo generacional",
    "Burocracia excesiva",
    "Falta de formación continuada",
    "Guardias y turnos abusivos"
];


const ScriptGeneratorPage: React.FC = () => {
  const { campaignPhase, setCampaignPhase } = useCampaign();
  const [formState, setFormState] = useState<FormState>({
    platform: 'Instagram',
    tone: 'Irónico',
    theme: 'Listas de espera interminables',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Omit<CampaignPost, 'id' | 'createdAt'> | null>(null);
  const [editedText, setEditedText] = useState("");
  const [savedPosts, setSavedPosts] = useLocalStorage<CampaignPost[]>('gallery-posts', []);

  const [inputMethod, setInputMethod] = useState<'text' | 'pdf' | 'topics'>('topics');
  const [pdfContent, setPdfContent] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>(sacylTopics[0]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFileName(null);
    setPdfContent(null);
    setIsParsing(true);

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            // @ts-ignore
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        setPdfContent(fullText.trim());
        setPdfFileName(file.name);
    } catch (error) {
        console.error("Error parsing PDF:", error);
        alert("No se pudo leer el PDF. Intenta con otro archivo.");
        setPdfFileName(null);
        setPdfContent(null);
    } finally {
        setIsParsing(false);
    }
  };

  const getThemeContent = () => {
    switch (inputMethod) {
        case 'text':
            return formState.theme;
        case 'pdf':
            return pdfContent;
        case 'topics':
            return selectedTopic;
        default:
            return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const themeContent = getThemeContent();

    if (!themeContent || themeContent.trim() === '') {
        alert('El tema no puede estar vacío.');
        setLoading(false);
        return;
    }

    try {
      // The campaignPhase now comes from the context
      const response = await generateSocialPost({ ...formState, theme: themeContent, campaignPhase });
      setResult(response);
      setEditedText(response.postText);
    } catch (error) {
      console.error(error);
      alert('Error al generar el contenido. La IA debe estar de baja.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegenerateImage = async () => {
      if (!result) return;
      setLoading(true);
      try {
          const themeContent = getThemeContent();
          if (!themeContent) {
            throw new Error("No theme content available for regeneration.");
          }
          const tempResult = await generateSocialPost({ ...formState, theme: themeContent, campaignPhase });
          setResult(prev => prev ? {...prev, imageB64: tempResult.imageB64, imagePrompt: tempResult.imagePrompt} : null);
      } catch (error) {
          console.error(error);
          alert('No se pudo regenerar la imagen. Quizás a la IA no le gustó el primer intento.');
      } finally {
          setLoading(false);
      }
  }
  
  const handleSave = () => {
      if(!result) return;
      const newPost: CampaignPost = {
          ...result,
          campaignPhase, // Save the phase with the post
          id: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          postText: editedText,
      };
      setSavedPosts(prev => [newPost, ...prev]);
      alert("¡Guardado en la galería! Listo para desmotivar al mundo.");
  };
  
  const handleCopy = () => {
      navigator.clipboard.writeText(editedText);
      alert("Texto copiado al portapapeles. Úsalo con sabiduría (o no).");
  }

  return (
    <div className="container mx-auto grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Generador de Contenido</CardTitle>
              <CardDescription>Crea la próxima publicación viral de P.A.S.O.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Plataforma</Label>
                <Select id="platform" name="platform" value={formState.platform} onChange={handleInputChange}>
                  <option>Instagram</option>
                  <option>Twitter</option>
                  <option>TikTok</option>
                  <option>Blog</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tono</Label>
                <Select id="tone" name="tone" value={formState.tone} onChange={handleInputChange}>
                  <option>Irónico</option>
                  <option>Humorístico</option>
                  <option>Crítico</option>
                  <option>Surrealista</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaignPhase">Fase de la Campaña</Label>
                 <Select id="campaignPhase" name="campaignPhase" value={campaignPhase} onChange={(e) => setCampaignPhase(e.target.value as CampaignPhase)}>
                  <option value="Llegada">1: La Llegada (Intriga)</option>
                  <option value="Observacion">2: La Observación (Sátira)</option>
                  <option value="Abduccion">3: La Abducción (Acción)</option>
                  <option value="Revelacion">4: La Revelación (Llamada)</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="flex rounded-md bg-secondary/50 p-1">
                    <Button type="button" variant={inputMethod === 'topics' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => setInputMethod('topics')}>
                        <List className="h-4 w-4 mr-2"/>Temas
                    </Button>
                    <Button type="button" variant={inputMethod === 'text' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => setInputMethod('text')}>
                        <Type className="h-4 w-4 mr-2"/>Texto
                    </Button>
                    <Button type="button" variant={inputMethod === 'pdf' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => setInputMethod('pdf')}>
                        <FileText className="h-4 w-4 mr-2"/>PDF
                    </Button>
                </div>
                
                {inputMethod === 'text' && (
                    <Textarea
                        id="theme"
                        name="theme"
                        value={formState.theme}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Describe el tema de la publicación o pega un texto largo aquí..."
                    />
                )}
                {inputMethod === 'pdf' && (
                    <div className="space-y-2">
                        <Input
                            type="file"
                            id="pdf-upload"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="file:text-foreground file:font-medium"
                            disabled={isParsing}
                        />
                        {isParsing && <Loader text="Analizando PDF..."/>}
                        {pdfFileName && !isParsing && (
                            <p className="text-xs text-foreground p-2 bg-secondary rounded-md">
                                Archivo cargado: {pdfFileName}
                            </p>
                        )}
                    </div>
                )}
                 {inputMethod === 'topics' && (
                    <Select id="topic-select" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                        {sacylTopics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </Select>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading || isParsing}>
                {loading ? <Loader text="Creando..." /> : 'Generar Script'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle>Resultado Generado</CardTitle>
            </CardHeader>
            <CardContent>
                {loading && !result && <div className="flex justify-center items-center h-96"><Loader text="La IA está reflexionando sobre la precariedad..."/></div> }
                {result && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <img src={`data:image/jpeg;base64,${result.imageB64}`} alt="Imagen generada" className="rounded-lg border-2 border-secondary/50" />
                           <Button variant="outline" size="sm" className="w-full" onClick={handleRegenerateImage} disabled={loading}>
                               <RefreshCw className="h-4 w-4 mr-2"/> Regenerar Imagen
                           </Button>
                        </div>
                        <div className="space-y-4">
                           <Label htmlFor="editedText">Texto de la Publicación</Label>
                           <Textarea 
                                id="editedText"
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                rows={12}
                                className="font-mono text-sm"
                           />
                           <div className="flex gap-2">
                               <Button variant="secondary" onClick={handleCopy} className="flex-1"><Copy className="h-4 w-4 mr-2"/> Copiar</Button>
                               <Button variant="accent" onClick={handleSave} className="flex-1"><Save className="h-4 w-4 mr-2"/> Guardar</Button>
                           </div>
                        </div>
                    </div>
                )}
                {!loading && !result && <div className="text-center text-muted-foreground h-96 flex items-center justify-center">El lienzo de la desesperación espera tus instrucciones.</div>}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScriptGeneratorPage;
