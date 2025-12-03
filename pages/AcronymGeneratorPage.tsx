

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Type, FileText, Image as ImageIcon, Wand2, Copy, ScanLine } from 'lucide-react';
import Loader from '../components/Loader';
import { generateCreativeAcronyms } from '../services/geminiService';
import { useCampaign } from '../contexts/CampaignContext';
import { AcronymGeneratorResult } from '../lib/types';
import * as pdfjsLib from 'pdfjs-dist';
import { cn } from '../lib/utils';

// Configure worker for PDF reading
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.mjs`;

const AcronymGeneratorPage: React.FC = () => {
    const { campaignPhase } = useCampaign();
    const [inputType, setInputType] = useState<'text' | 'pdf' | 'image'>('text');
    const [textInput, setTextInput] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [processingFile, setProcessingFile] = useState(false);
    const [result, setResult] = useState<AcronymGeneratorResult | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setProcessingFile(true);
        setFileContent(null);
        setImagePreview(null);

        try {
            if (inputType === 'pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = '';
                // Limit to first 3 pages to avoid huge payloads for acronym generation
                const maxPages = Math.min(pdf.numPages, 3); 
                for (let i = 1; i <= maxPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    // @ts-ignore
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }
                setFileContent(fullText.trim());
            } else if (inputType === 'image') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    // Remove data URL prefix for API if needed, but service handles it
                    const base64Data = base64String.split(',')[1]; 
                    setFileContent(base64Data);
                    setImagePreview(base64String);
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.error("Error parsing file:", error);
            alert("Error al leer el archivo.");
        } finally {
            setProcessingFile(false);
        }
    };

    const handleGenerate = async () => {
        const contentToProcess = inputType === 'text' ? textInput : fileContent;
        if (!contentToProcess) {
            alert("Por favor, proporciona un texto, sube un archivo o una imagen.");
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const type = inputType === 'image' ? 'image' : 'text';
            const response = await generateCreativeAcronyms(contentToProcess, type, campaignPhase);
            setResult(response);
        } catch (error) {
            console.error(error);
            alert("La IA se ha negado a colaborar. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copiado al portapapeles.");
    };

    return (
        <div className="container mx-auto grid lg:grid-cols-3 gap-8">
            <style>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                }
            `}</style>
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Generador de Acrónimos</CardTitle>
                        <CardDescription>
                            Transforma cualquier desgracia (texto, documento o foto) en una nueva definición de P.A.S.O.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex rounded-md bg-secondary/50 p-1">
                            <Button 
                                variant={inputType === 'text' ? 'secondary' : 'ghost'} 
                                className="flex-1" 
                                onClick={() => { setInputType('text'); setResult(null); }}
                            >
                                <Type className="h-4 w-4 mr-2" /> Texto
                            </Button>
                            <Button 
                                variant={inputType === 'pdf' ? 'secondary' : 'ghost'} 
                                className="flex-1" 
                                onClick={() => { setInputType('pdf'); setResult(null); }}
                            >
                                <FileText className="h-4 w-4 mr-2" /> PDF
                            </Button>
                            <Button 
                                variant={inputType === 'image' ? 'secondary' : 'ghost'} 
                                className="flex-1" 
                                onClick={() => { setInputType('image'); setResult(null); }}
                            >
                                <ImageIcon className="h-4 w-4 mr-2" /> Imagen
                            </Button>
                        </div>

                        {inputType === 'text' && (
                            <div className="space-y-2">
                                <Label>Tema o Situación</Label>
                                <Textarea 
                                    placeholder="Ej: La máquina de café se ha tragado mi moneda y mi alma."
                                    rows={6}
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                />
                            </div>
                        )}

                        {inputType === 'pdf' && (
                            <div className="space-y-4">
                                <Label>Sube un documento (Circular, BOCYL, Nota Informativa...)</Label>
                                <Input type="file" accept=".pdf" onChange={handleFileChange} />
                                {processingFile && <Loader text="Leyendo PDF..." />}
                                {fileName && !processingFile && <p className="text-xs text-ugt-green">Leído: {fileName}</p>}
                            </div>
                        )}

                        {inputType === 'image' && (
                            <div className="space-y-4">
                                <Label>Sube una foto (Sala de espera, cartel absurdo...)</Label>
                                <Input type="file" accept="image/*" onChange={handleFileChange} />
                                {imagePreview && (
                                    <div className="mt-2 relative aspect-video rounded-md overflow-hidden border border-secondary bg-black/20">
                                        <img src={imagePreview} alt="Preview" className={cn("object-cover w-full h-full transition-opacity duration-500", loading ? "opacity-50" : "opacity-100")} />
                                        
                                        {/* Visual Scanner Effect */}
                                        {loading && (
                                            <>
                                                <div className="absolute left-0 w-full h-1 bg-ugt-red shadow-[0_0_15px_rgba(227,6,19,0.8)] animate-scan z-10"></div>
                                                <div className="absolute inset-0 bg-ugt-red/10 z-0"></div>
                                                <div className="absolute top-2 left-2 bg-black/70 text-ugt-red text-[10px] font-mono px-2 py-1 rounded">ANALYZING INPUT...</div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <Button 
                            className="w-full" 
                            onClick={handleGenerate} 
                            disabled={loading || processingFile || (inputType === 'text' && !textInput) || (inputType !== 'text' && !fileContent)}
                        >
                            {loading ? (inputType === 'image' ? 'Analizando imagen...' : <Loader text="Inventando..." />) : <><Wand2 className="h-4 w-4 mr-2" /> Generar Acrónimos</>}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Resultados</CardTitle>
                        <CardDescription>Posibles significados para P.A.S.O. basados en tu input.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!result && !loading && (
                            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center p-6">
                                <Wand2 className="h-12 w-12 mb-4 opacity-20" />
                                <p>Esperando materia prima (quejas, fotos o documentos) para procesar.</p>
                            </div>
                        )}

                        {loading && inputType !== 'image' && (
                            <div className="flex flex-col items-center justify-center h-64">
                                <Loader text="Gemini 3 está consultando el diccionario del cinismo..." />
                            </div>
                        )}
                        
                        {loading && inputType === 'image' && (
                             <div className="flex flex-col items-center justify-center h-64 text-ugt-red font-mono animate-pulse">
                                <ScanLine className="h-12 w-12 mb-4" />
                                <p>EXTRAYENDO CONTEXTO VISUAL...</p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-secondary/30 p-4 rounded-lg border border-secondary">
                                    <h4 className="text-sm font-semibold text-ugt-green mb-2">Análisis del Oráculo:</h4>
                                    <p className="text-sm italic text-muted-foreground">{result.explanation}</p>
                                </div>

                                <div className="grid gap-4">
                                    {result.acronyms.map((acronym, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-background border border-secondary rounded-lg shadow-sm hover:border-ugt-green/50 transition-colors">
                                            <div className="flex-1">
                                                <p className="text-lg font-bold text-ugt-red">P.A.S.O.</p>
                                                <p className="text-md font-medium mt-1">{acronym}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(acronym)} title="Copiar">
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AcronymGeneratorPage;
