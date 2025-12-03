
import React, { useRef, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Download, RotateCcw, Award, HeartPulse, Coffee, Pill } from 'lucide-react';
// @ts-ignore - htmlToImage is imported from CDN
import * as htmlToImage from 'html-to-image';
import useLocalStorage from '../hooks/useLocalStorage';

type IconType = 'Award' | 'HeartPulse' | 'Coffee' | 'Pill';

interface DiplomaState {
    icon: IconType;
    title: string;
    recipient: string;
    body: string;
    signature: string;
    tagline: string;
}

const icons: Record<IconType, React.ElementType> = {
    Award,
    HeartPulse,
    Coffee,
    Pill
};

const initialDiplomaState: DiplomaState = {
    icon: 'Award',
    title: 'Certificado de Supervivencia',
    recipient: 'Un/a Profesional Sanitario/a Anónimo/a',
    body: 'Por demostrar una capacidad sobrehumana para soportar el absurdo, navegar la burocracia y mantener un pulso estable mientras el sistema se desmorona. Tu contribución al caos organizado no ha pasado desapercibida.',
    signature: 'El Sindicato P.A.S.O.',
    tagline: 'Si pasas de todo, sigue a tu P.A.S.O. Si quieres soluciones, UGT es tu sindicato.'
};

const DiplomaEditorPage: React.FC = () => {
    const [diplomaState, setDiplomaState] = useLocalStorage<DiplomaState>('diploma-custom-content', initialDiplomaState);
    const diplomaRef = useRef<HTMLDivElement>(null);

    const handleStateChange = (field: keyof DiplomaState, value: string) => {
        setDiplomaState(prev => ({ ...prev, [field]: value }));
    };

    const handleReset = () => {
        setDiplomaState(initialDiplomaState);
    };

    const handleDownload = useCallback(() => {
        if (diplomaRef.current === null) return;
        htmlToImage.toPng(diplomaRef.current, { cacheBust: true, backgroundColor: '#313642', pixelRatio: 2 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `diploma-paso-${diplomaState.title.toLowerCase().replace(/\s/g, '-')}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Error al generar la imagen del diploma', err);
            });
    }, [diplomaRef, diplomaState.title]);

    const SelectedIcon = icons[diplomaState.icon];

    return (
        <div className="container mx-auto grid lg:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Editor de Diplomas</CardTitle>
                    <CardDescription>
                        Personaliza el "premio" del Bingo del Precariado para cada fase de la campaña.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="icon">Icono</Label>
                        <Select id="icon" value={diplomaState.icon} onChange={(e) => handleStateChange('icon', e.target.value)}>
                            <option value="Award">Premio</option>
                            <option value="HeartPulse">Pulso Cardíaco</option>
                            <option value="Coffee">Taza de Café</option>
                            <option value="Pill">Píldora</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="title">Título Principal</Label>
                        <Input id="title" value={diplomaState.title} onChange={(e) => handleStateChange('title', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="recipient">Destinatario</Label>
                        <Input id="recipient" value={diplomaState.recipient} onChange={(e) => handleStateChange('recipient', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="body">Cuerpo del Mensaje</Label>
                        <Textarea id="body" rows={5} value={diplomaState.body} onChange={(e) => handleStateChange('body', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signature">Firma</Label>
                        <Input id="signature" value={diplomaState.signature} onChange={(e) => handleStateChange('signature', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tagline">Línea Final (Tagline)</Label>
                        <Textarea id="tagline" rows={2} value={diplomaState.tagline} onChange={(e) => handleStateChange('tagline', e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={handleDownload} variant="accent" className="flex-1">
                        <Download className="h-4 w-4 mr-2" /> Descargar Diploma
                    </Button>
                    <Button onClick={handleReset} variant="destructive" className="flex-1">
                        <RotateCcw className="h-4 w-4 mr-2" /> Restaurar Original
                    </Button>
                </CardFooter>
            </Card>

            <div className="flex items-center justify-center p-4 bg-secondary/30 rounded-lg">
                <div ref={diplomaRef} className="bg-secondary/30 p-8 border-2 border-dashed border-ugt-green rounded-lg text-foreground w-[450px]">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <SelectedIcon className="mx-auto h-16 w-16 text-ugt-green" />
                        <h2 className="text-3xl font-bold text-ugt-green">{diplomaState.title}</h2>
                        <p className="text-sm text-muted-foreground">Otorgado a:</p>
                        <p className="font-semibold text-lg border-b-2 border-muted-foreground/50 pb-1 px-8">{diplomaState.recipient}</p>
                        <p className="max-w-prose text-sm">{diplomaState.body}</p>
                        <div className="pt-6 w-full">
                            <p className="font-bold text-sm">Firmado con resignación,</p>
                            <p className="font-serif text-lg text-ugt-red/80 mt-2">- {diplomaState.signature}</p>
                            <p className="text-sm text-foreground mt-6 border-t border-muted-foreground/30 pt-4">
                               <span dangerouslySetInnerHTML={{ __html: diplomaState.tagline.replace('UGT', '<span class="font-bold text-ugt-red">UGT</span>') }} />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiplomaEditorPage;
