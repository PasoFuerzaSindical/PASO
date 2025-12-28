

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
import { Download, Sparkles, AlertTriangle, X, Plus, Move, Image as ImageIcon, Layers, ImagePlus, Trash2 } from 'lucide-react';
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
    id: string;
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
    images: ImageElement[];
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
    images: [],
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
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const posterRef = useRef<HTMLDivElement>(null);
    const { campaignPhase } = useCampaign();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSingleTextChange = (
        elementKey: keyof Omit<PosterState, 'backgroundColor' | 'sloganLines' | 'images'>,
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
                const newId = `img-${Date.now()}`;
                const newImage: ImageElement = {
                    id: newId,
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
                setPosterState(prev => ({ ...prev, images: [...prev.images, newImage] }));
                setSelectedImageId(newId);
            };
            reader.readAsDataURL(file);
        }
        // Reset value to allow re-uploading same file if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageStyleChange = (property: keyof Omit<ImageElement, 'src' | 'id'>, value: string | number) => {
        if (!selectedImageId) return;

        setPosterState(prev => ({
            ...prev,
            images: prev.images.map(img => {
                if (img.id !== selectedImageId) return img;
                const numericProps: (keyof Omit<ImageElement, 'src' | 'id'>)[] = ['size', 'opacity', 'top', 'left', 'zIndex', 'blur', 'overlayOpacity'];
                // @ts-ignore
                const finalValue = numericProps.includes(property) ? Number(value) : value;
                return { ...img, [property]: finalValue };
            })
        }));
    };

    const removeImage = () => {
        if (!selectedImageId) return;
        setPosterState(prev => ({ ...prev, images: prev.images.filter(img => img.id !== selectedImageId) }));
        setSelectedImageId(null);
    };
    
    const getSelectedImage = () => {
        return posterState.images.find(img => img.id === selectedImageId) || null;
    }


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

    const renderSingleTextControls = (elementKey: keyof Omit<PosterState, 'backgroundColor' | 'sloganLines' | 'images'>, label: string) => {
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

    const activeImage = getSelectedImage();

    return (
        <div className="container mx-auto grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Generador de Carteles</CardTitle>
                    <CardDescription>
                        Personaliza cada detalle del cartel. Añade múltiples capas de imágenes.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
                    <fieldset className="border border-secondary/50 p-3 rounded-lg">
                        <legend className="px-1 text-sm font-medium text-muted-foreground">Fondo Global</legend>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="backgroundColor">Color:</Label>
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
                        <legend className="px-1 text-sm font-medium text-muted-foreground">Imágenes / Capas</legend>
                        
                        {/* Image Manager Header */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {posterState.images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImageId(img.id)}
                                    className={cn(
                                        "px-3 py-1 text-xs rounded-full border transition-all",
                                        selectedImageId === img.id 
                                            ? "bg-ugt-green text-black border-ugt-green font-bold" 
                                            : "bg-secondary/50 border-transparent text-muted-foreground hover:bg-secondary"
                                    )}
                                >
                                    Img {idx + 1}
                                </button>
                            ))}
                            <Button 
                                type="button" 
                                size="sm" 
                                variant="outline" 
                                className="h-6 text-xs rounded-full px-3"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Plus className="h-3 w-3 mr-1" /> Nueva
                            </Button>
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageUpload} 
                            />
                        </div>

                        {!activeImage && posterState.images.length === 0 && (
                             <div className="text-center p-4 border-2 border-dashed border-secondary rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">No hay imágenes añadidas</p>
                                <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                                    <ImagePlus className="h-4 w-4 mr-2" /> Subir Imagen
                                </Button>
                             </div>
                        )}

                        {activeImage && (
                            <div className="space-y-4 animate-fade-in bg-secondary/10 p-2 rounded-md">
                                <div className="flex justify-between items-center border-b border-border pb-2 mb-2">
                                    <span className="text-xs font-bold text-ugt-green">Editando: Img {posterState.images.findIndex(i => i.id === activeImage.id) + 1}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={removeImage}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex rounded-md bg-secondary/50 p-1">
                                    <Button type="button" variant={activeImage.positioningMode === 'normal' ? 'secondary' : 'ghost'} className="flex-1 text-[10px] h-7 px-1" onClick={() => handleImageStyleChange('positioningMode', 'normal')}><Layers className="h-3 w-3 mr-1"/>Normal</Button>
                                    <Button type="button" variant={activeImage.positioningMode === 'background' ? 'secondary' : 'ghost'} className="flex-1 text-[10px] h-7 px-1" onClick={() => handleImageStyleChange('positioningMode', 'background')}><ImageIcon className="h-3 w-3 mr-1"/>Fondo</Button>
                                    <Button type="button" variant={activeImage.positioningMode === 'absolute' ? 'secondary' : 'ghost'} className="flex-1 text-[10px] h-7 px-1" onClick={() => handleImageStyleChange('positioningMode', 'absolute')}><Move className="h-3 w-3 mr-1"/>Libre</Button>
                                </div>

                                {activeImage.positioningMode === 'normal' && (
                                    <div className="space-y-3 p-2">
                                        <div><Label className="text-xs">Tamaño ({activeImage.size}%)</Label><input type="range" min="10" max="100" value={activeImage.size} onChange={e => handleImageStyleChange('size', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                        <div><Label className="text-xs">Opacidad ({Math.round(activeImage.opacity * 100)}%)</Label><input type="range" min="0" max="1" step="0.1" value={activeImage.opacity} onChange={e => handleImageStyleChange('opacity', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                    </div>
                                )}

                                {activeImage.positioningMode === 'absolute' && (
                                    <div className="space-y-3 p-2">
                                        <div><Label className="text-xs">Tamaño ({activeImage.size}%)</Label><input type="range" min="5" max="150" value={activeImage.size} onChange={e => handleImageStyleChange('size', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                        <div><Label className="text-xs">Opacidad ({Math.round(activeImage.opacity * 100)}%)</Label><input type="range" min="0" max="1" step="0.05" value={activeImage.opacity} onChange={e => handleImageStyleChange('opacity', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                        <div><Label className="text-xs">Pos. Vertical ({activeImage.top}%)</Label><input type="range" min="0" max="100" value={activeImage.top} onChange={e => handleImageStyleChange('top', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                        <div><Label className="text-xs">Pos. Horizontal ({activeImage.left}%)</Label><input type="range" min="0" max="100" value={activeImage.left} onChange={e => handleImageStyleChange('left', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                        <div><Label className="text-xs">Capa (Z-Index)</Label><div className="flex rounded-md bg-secondary/50 p-1"><Button type="button" variant={activeImage.zIndex < 10 ? 'secondary' : 'ghost'} className="flex-1 text-xs h-6" onClick={() => handleImageStyleChange('zIndex', 5)}>Detrás</Button><Button type="button" variant={activeImage.zIndex >= 10 ? 'secondary' : 'ghost'} className="flex-1 text-xs h-6" onClick={() => handleImageStyleChange('zIndex', 15)}>Delante</Button></div></div>
                                    </div>
                                )}

                                {activeImage.positioningMode === 'background' && (
                                     <div className="space-y-3 p-2">
                                        <div><Label className="text-xs">Ajuste</Label><Select value={activeImage.backgroundSize} onChange={e => handleImageStyleChange('backgroundSize', e.target.value)}><option value="cover">Cubrir</option><option value="contain">Contener</option></Select></div>
                                        <div><Label className="text-xs">Opacidad ({Math.round(activeImage.opacity * 100)}%)</Label><input type="range" min="0" max="1" step="0.05" value={activeImage.opacity} onChange={e => handleImageStyleChange('opacity', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                        <div><Label className="text-xs">Desenfoque ({activeImage.blur}px)</Label><input type="range" min="0" max="20" value={activeImage.blur} onChange={e => handleImageStyleChange('blur', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                        <div className="border border-secondary/50 p-2 rounded-md space-y-2">
                                            <Label className="text-xs font-medium">Capa de color</Label>
                                            <div className="flex items-center gap-2"><Label className="text-xs">Color:</Label><Input type="color" value={activeImage.overlayColor} onChange={(e) => handleImageStyleChange('overlayColor', e.target.value)} className="w-12 h-8 p-1"/></div>
                                            <div><Label className="text-xs">Opacidad ({Math.round(activeImage.overlayOpacity * 100)}%)</Label><input type="range" min="0" max="1" step="0.05" value={activeImage.overlayOpacity} onChange={e => handleImageStyleChange('overlayOpacity', e.target.value)} className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"/></div>
                                        </div>
                                    </div>
                                )}
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
                        {loading ? <Loader text="Inspirándose..."/> : <><Sparkles className="h-4 w-4 mr-2" /> Sugerir Textos</>}
                    </Button>
                    <Button onClick={handleDownload} variant="accent" className="w-full sm:w-auto">
                        <Download className="h-4 w-4 mr-2" /> Descargar Cartel
                    </Button>
                </CardFooter>
            </Card>

            <div className="flex items-center justify-center p-4 bg-secondary/30 rounded-lg relative z-[50] overflow-x-auto">
                <div
                    ref={posterRef}
                    style={{ backgroundColor: posterState.backgroundColor }}
                    className="w-[400px] h-[565px] p-8 flex flex-col font-sans shadow-2xl overflow-hidden relative z-[60] shrink-0"
                >
                    {/* Background Images Layer */}
                    {posterState.images.filter(img => img.positioningMode === 'background').map(img => (
                         <React.Fragment key={img.id}>
                           <div style={{
                                position: 'absolute', inset: 0, zIndex: 0,
                                backgroundImage: `url(${img.src})`,
                                backgroundSize: img.backgroundSize,
                                backgroundPosition: 'center',
                                opacity: img.opacity,
                                filter: `blur(${img.blur}px)`,
                           }} />
                           <div style={{
                                position: 'absolute', inset: 0, zIndex: 1,
                                backgroundColor: img.overlayColor,
                                opacity: img.overlayOpacity,
                           }} />
                        </React.Fragment>
                    ))}
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="text-center">
                            <p style={{ fontSize: `${posterState.headline.fontSize}px`, color: posterState.headline.color, fontWeight: '600' }} className="tracking-wider break-words">
                                {posterState.headline.text}
                            </p>
                        </div>
                        
                        <div className="text-center my-8 flex flex-col items-center gap-4 flex-1 justify-center">
                            {/* Normal positioning images */}
                            {posterState.images.filter(img => img.positioningMode === 'normal').map(img => (
                                 <img
                                     key={img.id}
                                     src={img.src}
                                     alt="Motivo del cartel"
                                     className="object-contain"
                                     style={{
                                         width: `${img.size}%`,
                                         opacity: img.opacity,
                                         maxHeight: '200px'
                                     }}
                                 />
                            ))}
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
                    
                    {/* Absolute positioning images */}
                     {posterState.images.filter(img => img.positioningMode === 'absolute').map(img => (
                        <img
                             key={img.id}
                             src={img.src}
                             alt="Motivo del cartel"
                             style={{
                                 position: 'absolute',
                                 top: `${img.top}%`,
                                 left: `${img.left}%`,
                                 width: `${img.size}%`,
                                 opacity: img.opacity,
                                 zIndex: img.zIndex,
                                 transform: 'translate(-50%, -50%)',
                                 pointerEvents: 'none',
                             }}
                         />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PosterGeneratorPage;