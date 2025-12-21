

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import Loader from '../components/Loader';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';
import { PosterContent } from '../lib/types';
import { generatePosterContent } from '../services/geminiService';
import { Download, Sparkles, AlertTriangle, X, Plus, Move, Image as ImageIcon, Layers } from 'lucide-react';
// @ts-ignore - htmlToImage is imported from CDN
import * as htmlToImage from 'html-to-image';
import { cn } from '../lib/utils';
// Fix: Import the Select component
import { Select } from '../components/ui/Select';
import { useCampaign } from '../contexts/CampaignContext';


interface TextElement {
    id: string;
    text: string;
    fontSize: number;
    color: string;
}

interface ImageElement {
    src: string;
    positioningMode: 'normal' | 'background' | 'absolute';
    top: number;
    left: number;
    zIndex: number;
    backgroundSize: 'cover' | 'contain';
    blur: number;
    overlayColor: string;
    overlayOpacity: number;
    size: number;
    opacity: number;
}

interface PosterState {
    backgroundColor: string;
    headline: TextElement;
    sloganLines: TextElement[];
    subtitle: TextElement;
    image: ImageElement | null;
    footerLine1: TextElement;
    footerLine2: TextElement;
    footerLine3: TextElement;
}

const initialPosterState: PosterState = {
    backgroundColor: '#f9fafb',
    headline: {
        id: 'headline',
        text: '¿OTRA VEZ ELECCIONES SINDICALES?',
        fontSize: 18,
        color: '#1f2937',
    },
    sloganLines: [{
        id: `slogan-${Date.now()}`,
        text: 'EN ESTAS ELECCIONES,\nP.A.S.O.',
        fontSize: 48,
        color: '#E30613',
    }],
    subtitle: {
        id: 'subtitle',
        text: '¿Y si pasar fuera el primer paso?',
        fontSize: 18,
        color: '#6b7280',
    },
    image: null,
    footerLine1: {
        id: 'footer1',
        text: 'Elecciones Sindicales',
        fontSize: 14,
        color: '#111827',
    },
    footerLine2: {
        id: 'footer2',
        text: 'Sanidad Salamanca',
        fontSize: 12,
        color: '#6b7280',
    },
    footerLine3: {
        id: 'footer3',
        text: 'Una iniciativa de Los de Siempre',
        fontSize: 12,
        color: '#16a34a',
    },
};

const PosterGeneratorPage: React.FC = () => {
    const [posterState, setPosterState] = useState<PosterState>(initialPosterState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const posterRef = useRef<HTMLDivElement>(null);
    const { campaignPhase } = useCampaign();

    const handleSingleTextChange = (
        elementKey: keyof Omit<PosterState, 'backgroundColor' | 'sloganLines' | 'image'>,
        property: keyof Omit<TextElement, 'id'>,
        value: string | number
    ) => {
        setPosterState(prev => ({
            ...prev,
            [elementKey]: {
                ...prev[elementKey],
                [property]: property === 'fontSize' ? parseInt(value as string, 10) : value,
            },
        }));
    };

    const handleSloganLineChange = (id: string, property: keyof Omit<TextElement, 'id'>, value: string | number) => {
        setPosterState(prev => ({
            ...prev,
            sloganLines: prev.sloganLines.map(line =>
                line.id === id
                    ? { ...line, [property]: property === 'fontSize' ? parseInt(value as string, 10) : value }
                    : line
            ),
        }));
    };

    const addSloganLine = () => {
        const newLine: TextElement = {
            id: `slogan-${Date.now()}`,
            text: 'Nueva Línea',
            fontSize: 32,
            color: '#1f2937',
        };
        setPosterState(prev => ({ ...prev, sloganLines: [...prev.sloganLines, newLine] }));
    };

    const removeSloganLine = (id: string) => {
        setPosterState(prev => ({
            ...prev,
            sloganLines: prev.sloganLines.filter(line => line.id !== id),
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage: ImageElement = {
                    src: reader.result as string,
                    positioningMode: 'normal',
                    size: 50,
                    opacity: 1,
                    top: 50,
                    left: 50,
                    zIndex: 5,
                    backgroundSize: 'cover',
                    blur: 0,
                    overlayColor: '#000000',
                    overlayOpacity: 0.3,
                };
                setPosterState(prev => ({ ...prev, image: newImage }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageStyleChange = (property: keyof Omit<ImageElement, 'src'>, value: string | number) => {
        setPosterState(prev => {
            if (!prev.image) return prev;
            const numericProps: (keyof Omit<ImageElement, 'src'>)[] = ['size', 'opacity', 'top', 'left', 'zIndex', 'blur', 'overlayOpacity'];
            const finalValue = numericProps.includes(property) ? Number(value) : value;
            return {
                ...prev,
                image: { ...prev.image, [property]: finalValue }
            };
        });
    };

    const removeImage = () => {
        setPosterState(prev => ({ ...prev, image: null }));
    };


    const handleGenerateText = async () => {
        setLoading(true);
        setError(null);
        try {
            const newContent = await generatePosterContent(campaignPhase);
            setPosterState(prev => ({
                ...prev,
                headline: { ...prev.headline, text: newContent.headline },
                sloganLines: [{ ...prev.sloganLines[0], text: newContent.slogan }],
                subtitle: { ...prev.subtitle, text: newContent.subtitle },
            }));
        } catch (err) {
            setError('La IA está de guardia. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = useCallback(() => {
        if (posterRef.current === null) {
            return;
        }
        htmlToImage.toPng(posterRef.current, { cacheBust: true, pixelRatio: 2 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'cartel-paso-salamanca.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Error al generar la imagen del cartel', err);
                setError('No se pudo descargar el cartel. Quizás el navegador está de huelga.');
            });
    }, [posterRef]);

    const renderSingleTextControls = (elementKey: keyof Omit<PosterState, 'backgroundColor' | 'sloganLines' | 'image'>, label: string) => {
        const element = posterState[elementKey];
        return (
            <fieldset className="border border-secondary/50 p-3 rounded-lg">
                <legend className="px-1 text-sm font-medium text-muted-foreground">{label}</legend>
                <div className="space-y-2">
                    <Input
                        id={`${elementKey}-text`}
                        value={element.text}
                        onChange={(e) => handleSingleTextChange(elementKey, 'text', e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                        <Label htmlFor={`${elementKey}-fontSize`} className="text-xs whitespace-nowrap">Tamaño:</Label>
                        <Input
                            id={`${elementKey}-fontSize`}
                            type="number"
                            value={element.fontSize}
                            onChange={(e) => handleSingleTextChange(elementKey, 'fontSize', e.target.value)}
                            className="w-20 h-8"
                        />
                        <Label htmlFor={`${elementKey}-color`} className="text-xs whitespace-nowrap">Color:</Label>
                        <Input
                            id={`${elementKey}-color`}
                            type="color"
                            value={element.color}
                            onChange={(e) => handleSingleTextChange(elementKey, 'color', e.target.value)}
                            className="w-12 h-8 p-1"
                        />
                    </div>
                </div>
            </fieldset>
        );
    };

    return (
        <div className="container mx-auto grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Generador de Carteles</CardTitle>
                    <CardDescription>
                        Personaliza cada detalle del cartel para la campaña.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <fieldset className="border border-secondary/50 p-3 rounded-lg">
                        <legend className="px-1 text-sm font-medium text-muted-foreground">Fondo</legend>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="backgroundColor">Color de fondo:</Label>
                            <Input
                                id="backgroundColor"
                                type="color"
                                value={posterState.backgroundColor}
                                onChange={(e) => setPosterState(p => ({ ...p, backgroundColor: e.target.value }))}
                                className="w-12 h-8 p-1"
                            />
                        </div>
                    </fieldset>

                    {renderSingleTextControls('headline', 'Titular')}

                    <fieldset className="border border-secondary/50 p-3 rounded-lg space-y-3">
                        <legend className="px-1 text-sm font-medium text-muted-foreground">Mensaje Central</legend>
                        {posterState.sloganLines.map((line, index) => (
                            <div key={line.id} className="p-2 bg-secondary/30 rounded-md space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor={`${line.id}-text`} className="text-xs">Línea {index + 1}</Label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeSloganLine(line.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    id={`${line.id}-text`}
                                    value={line.text}
                                    onChange={(e) => handleSloganLineChange(line.id, 'text', e.target.value)}
                                    rows={2}
                                />
                                <div className="flex items-center gap-2">
                                    <Label htmlFor={`${line.id}-fontSize`} className="text-xs whitespace-nowrap">Tamaño:</Label>
                                    <Input
                                        id={`${line.id}-fontSize`}
                                        type="number"
                                        value={line.fontSize}
                                        onChange={(e) => handleSloganLineChange(line.id, 'fontSize', e.target.value)}
                                        className="w-20 h-8"
                                    />
                                    <Label htmlFor={`${line.id}-color`} className="text-xs whitespace-nowrap">Color:</Label>
                                    <Input
                                        id={`${line.id}-color`}
                                        type="color"
                                        value={line.color}
                                        onChange={(e) => handleSloganLineChange(line.id, 'color', e.target.value)}
                                        className="w-12 h-8 p-1"
                                    />
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={addSloganLine} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Añadir Línea
                        </Button>
                    </fieldset>

                    {renderSingleTextControls('subtitle', 'Subtítulo')}

                    <fieldset className="border border-secondary/50 p-3 rounded-lg space-y-3">
                        <legend className="px-1 text-sm font-medium text-muted-foreground">Imagen / Icono</legend>
                        {!posterState.image ? (
                            <Input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs" />
                        ) : (
                            <div className="space-y-4">
                                <div className="flex rounded-md bg-secondary/50 p-1">
                                    <Button type="button" variant={posterState.image.positioningMode === 'normal' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => handleImageStyleChange('positioningMode', 'normal')}><Layers className="h-4 w-4 mr-2" />Normal</Button>
                                    <Button type="button" variant={posterState.image.positioningMode === 'background' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => handleImageStyleChange('positioningMode', 'background')}><ImageIcon className="h-4 w-4 mr-2" />Fondo</Button>
                                    <Button type="button" variant={posterState.image.positioningMode === 'absolute' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => handleImageStyleChange('positioningMode', 'absolute')}><Move className="h-4 w-4 mr-2" />Libre</Button>
                                </div>

                                {posterState.image.positioningMode === 'normal' && (
                                    <div className="space-y-3 p-2">
                                        <div><Label className="text-xs">Tamaño ({posterState.image.size}%)</Label><input type="range" min="10" max="100" value={posterState.image.size} onChange={e => handleImageStyleChange('size', e.target.value)} className="w-full" /></div>
                                        <div><Label className="text-xs">Opacidad ({Math.round(posterState.image.opacity * 100)}%)</Label><input type="range" min="0" max="1" step="0.1" value={posterState.image.opacity} onChange={e => handleImageStyleChange('opacity', e.target.value)} className="w-full" /></div>
                                    </div>
                                )}

                                {posterState.image.positioningMode === 'absolute' && (
                                    <div className="space-y-3 p-2">
                                        <div><Label className="text-xs">Tamaño ({posterState.image.size}%)</Label><input type="range" min="5" max="150" value={posterState.image.size} onChange={e => handleImageStyleChange('size', e.target.value)} className="w-full" /></div>
                                        <div><Label className="text-xs">Opacidad ({Math.round(posterState.image.opacity * 100)}%)</Label><input type="range" min="0" max="1" step="0.05" value={posterState.image.opacity} onChange={e => handleImageStyleChange('opacity', e.target.value)} className="w-full" /></div>
                                        <div><Label className="text-xs">Posición Vertical ({posterState.image.top}%)</Label><input type="range" min="0" max="100" value={posterState.image.top} onChange={e => handleImageStyleChange('top', e.target.value)} className="w-full" /></div>
                                        <div><Label className="text-xs">Posición Horizontal ({posterState.image.left}%)</Label><input type="range" min="0" max="100" value={posterState.image.left} onChange={e => handleImageStyleChange('left', e.target.value)} className="w-full" /></div>
                                        <div><Label className="text-xs">Capa</Label><div className="flex rounded-md bg-secondary/50 p-1"><Button type="button" variant={posterState.image.zIndex < 10 ? 'secondary' : 'ghost'} className="flex-1 text-xs" onClick={() => handleImageStyleChange('zIndex', 5)}>Detrás del Texto</Button><Button type="button" variant={posterState.image.zIndex >= 10 ? 'secondary' : 'ghost'} className="flex-1 text-xs" onClick={() => handleImageStyleChange('zIndex', 15)}>Delante del Texto</Button></div></div>
                                    </div>
                                )}

                                {posterState.image.positioningMode === 'background' && (
                                    <div className="space-y-3 p-2">
                                        <div><Label className="text-xs">Ajuste</Label><Select value={posterState.image.backgroundSize} onChange={e => handleImageStyleChange('backgroundSize', e.target.value)}><option value="cover">Cubrir</option><option value="contain">Contener</option></Select></div>
                                        <div><Label className="text-xs">Opacidad ({Math.round(posterState.image.opacity * 100)}%)</Label><input type="range" min="0" max="1" step="0.05" value={posterState.image.opacity} onChange={e => handleImageStyleChange('opacity', e.target.value)} className="w-full" /></div>
                                        <div><Label className="text-xs">Desenfoque ({posterState.image.blur}px)</Label><input type="range" min="0" max="20" value={posterState.image.blur} onChange={e => handleImageStyleChange('blur', e.target.value)} className="w-full" /></div>
                                        <div className="border border-secondary/50 p-2 rounded-md space-y-2">
                                            <Label className="text-xs font-medium">Capa de color</Label>
                                            <div className="flex items-center gap-2"><Label className="text-xs">Color:</Label><Input type="color" value={posterState.image.overlayColor} onChange={(e) => handleImageStyleChange('overlayColor', e.target.value)} className="w-12 h-8 p-1" /></div>
                                            <div><Label className="text-xs">Opacidad ({Math.round(posterState.image.overlayOpacity * 100)}%)</Label><input type="range" min="0" max="1" step="0.05" value={posterState.image.overlayOpacity} onChange={e => handleImageStyleChange('overlayOpacity', e.target.value)} className="w-full" /></div>
                                        </div>
                                    </div>
                                )}
                                <Button variant="destructive" size="sm" onClick={removeImage} className="w-full">Quitar Imagen</Button>
                            </div>
                        )}
                    </fieldset>

                    {renderSingleTextControls('footerLine1', 'Pie de página - Línea 1')}
                    {renderSingleTextControls('footerLine2', 'Pie de página - Línea 2')}
                    {renderSingleTextControls('footerLine3', 'Pie de página - Línea 3')}

                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error Creativo</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleGenerateText} className="w-full sm:w-auto" disabled={loading}>
                        {loading ? <Loader text="Inspirándose..." /> : <><Sparkles className="h-4 w-4 mr-2" /> Sugerir Textos</>}
                    </Button>
                    <Button onClick={handleDownload} variant="accent" className="w-full sm:w-auto">
                        <Download className="h-4 w-4 mr-2" /> Descargar Cartel
                    </Button>
                </CardFooter>
            </Card>

            <div className="flex items-center justify-center p-4 bg-secondary/30 rounded-lg relative z-[50]">
                <div
                    ref={posterRef}
                    style={{ backgroundColor: posterState.backgroundColor }}
                    className="w-[400px] h-[565px] p-8 flex flex-col font-sans shadow-2xl overflow-hidden relative z-[60]"
                >
                    {posterState.image && posterState.image.positioningMode === 'background' && (
                        <>
                            <div style={{
                                position: 'absolute', inset: 0, zIndex: 0,
                                backgroundImage: `url(${posterState.image.src})`,
                                backgroundSize: posterState.image.backgroundSize,
                                backgroundPosition: 'center',
                                opacity: posterState.image.opacity,
                                filter: `blur(${posterState.image.blur}px)`,
                            }} />
                            <div style={{
                                position: 'absolute', inset: 0, zIndex: 1,
                                backgroundColor: posterState.image.overlayColor,
                                opacity: posterState.image.overlayOpacity,
                            }} />
                        </>
                    )}

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="text-center">
                            <p style={{ fontSize: `${posterState.headline.fontSize}px`, color: posterState.headline.color, fontWeight: '600' }} className="tracking-wider">
                                {posterState.headline.text}
                            </p>
                        </div>

                        <div className="text-center my-8 flex flex-col items-center gap-4">
                            {posterState.image && posterState.image.positioningMode === 'normal' && (
                                <img
                                    src={posterState.image.src}
                                    alt="Motivo del cartel"
                                    className="max-h-[150px] object-contain"
                                    style={{
                                        width: `${posterState.image.size}%`,
                                        opacity: posterState.image.opacity,
                                    }}
                                />
                            )}
                            {posterState.sloganLines.map(line => (
                                <pre
                                    key={line.id}
                                    style={{ fontSize: `${line.fontSize}px`, color: line.color, fontWeight: '800' }}
                                    className="whitespace-pre-wrap leading-tight font-sans text-center"
                                >
                                    {line.text}
                                </pre>
                            ))}
                        </div>

                        <div className="text-center">
                            <p style={{ fontSize: `${posterState.subtitle.fontSize}px`, color: posterState.subtitle.color, fontStyle: 'italic' }}>
                                {posterState.subtitle.text}
                            </p>
                        </div>

                        <div className="border-t border-gray-300 pt-4 mt-8 text-center">
                            <p style={{ fontSize: `${posterState.footerLine1.fontSize}px`, color: posterState.footerLine1.color, fontWeight: '700' }} className="tracking-widest">
                                {posterState.footerLine1.text}
                            </p>
                            <p style={{ fontSize: `${posterState.footerLine2.fontSize}px`, color: posterState.footerLine2.color }}>
                                {posterState.footerLine2.text}
                            </p>
                            <p style={{ fontSize: `${posterState.footerLine3.fontSize}px`, color: posterState.footerLine3.color, fontWeight: '700' }} className="mt-2">
                                {posterState.footerLine3.text}
                            </p>
                        </div>
                    </div>
                    {posterState.image && posterState.image.positioningMode === 'absolute' && (
                        <img
                            src={posterState.image.src}
                            alt="Motivo del cartel"
                            style={{
                                position: 'absolute',
                                top: `${posterState.image.top}%`,
                                left: `${posterState.image.left}%`,
                                width: `${posterState.image.size}%`,
                                opacity: posterState.image.opacity,
                                zIndex: posterState.image.zIndex,
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none',
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PosterGeneratorPage;
