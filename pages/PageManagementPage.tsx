
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import useLocalStorage from '../hooks/useLocalStorage';
import { PageContentPillar } from '../lib/types';
import { Save, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';


const initialPhilosophyPillars: PageContentPillar[] = [
  {
    phase: 'Llegada',
    title: "Has Recibido una Transmisión",
    description: "Hemos detectado una anomalía en vuestro sector. Un patrón de resignación que resuena en el cosmos. Nos llamamos P.A.S.O. No venimos a liderar, venimos a observar. A entender por qué los que más cuidan han dejado de hacerse oír. Permaneced a la escucha.",
  },
  {
    phase: 'Observacion',
    title: "Informe de Campo: El Ecosistema Sanitario",
    description: "Nuestros sensores analizan vuestro hábitat. Rituales curiosos como la 'queja del café', que se disipa al volver al puesto. Comportamientos de evitación frente a tablones con información vital. Fascinante. Os reconocéis, ¿verdad? No estáis solos en esta observación.",
  },
  {
    phase: 'Abduccion',
    title: "Iniciando Protocolo de Abducción",
    description: "La observación pasiva ha terminado. Es hora de alterar la frecuencia. No es una abducción física, es un despertar de la conciencia. Un recordatorio de que 'pasar' es una elección, no un destino. El primer paso es cuestionar. El primer acto de rebeldía es mirar el tablón, preguntar al compañero. ¿Sientes el cambio?",
  },
  {
    phase: 'Revelacion',
    title: "Fin de la Transmisión. Inicio de la Conexión.",
    description: "P.A.S.O. nunca fue una entidad cósmica. Fuimos un espejo. Una idea nacida de vuestros propios compañeros en UGT, un intento de hablar un idioma diferente cuando el de siempre ya no se escuchaba. La ironía era el vehículo, pero el destino es real: recuperar la dignidad. P.A.S.O. se disuelve ahora en cada uno de vosotros que decide actuar. La Fuerza Sindical sois vosotros. UGT es la herramienta.",
  },
];

const PageManagementPage: React.FC = () => {
    const [content, setContent] = useLocalStorage<PageContentPillar[]>('filosofia-page-content', initialPhilosophyPillars);
    const [success, setSuccess] = useState(false);

    const handleContentChange = (index: number, field: 'title' | 'description', value: string) => {
        const newContent = [...content];
        newContent[index][field] = value;
        setContent(newContent);
    };

    const handleSave = () => {
        // The useLocalStorage hook already saves on change, but we can use this for user feedback
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    return (
        <div className="container mx-auto max-w-4xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Gestión de Páginas</CardTitle>
                    <CardDescription>
                        Edita el contenido de las páginas estáticas de la aplicación.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <h3 className="text-xl font-semibold border-b pb-2">Página: Filosofía P.A.S.O.</h3>
                    {content.map((pillar, index) => (
                        <div key={pillar.phase} className="p-4 border border-secondary/50 rounded-lg space-y-4">
                            <h4 className="font-medium text-ugt-green">Fase {index + 1}: {pillar.phase}</h4>
                            <div className="space-y-2">
                                <Label htmlFor={`title-${index}`}>Título</Label>
                                <Input 
                                    id={`title-${index}`} 
                                    value={pillar.title}
                                    onChange={(e) => handleContentChange(index, 'title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`description-${index}`}>Descripción</Label>
                                <Textarea 
                                    id={`description-${index}`} 
                                    rows={4}
                                    value={pillar.description}
                                    onChange={(e) => handleContentChange(index, 'description', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        {success ? '¡Contenido Guardado!' : 'Guardar Cambios'}
                    </Button>
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Guardado Automático</AlertTitle>
                        <AlertDescription>
                           Tus cambios se guardan automáticamente mientras escribes. Este botón es solo para confirmar.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PageManagementPage;
