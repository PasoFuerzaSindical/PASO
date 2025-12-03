
import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { SavedConsultation } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trash2 } from 'lucide-react';

const ConsultorioAdminPage: React.FC = () => {
    const [savedConsultations, setSavedConsultations] = useLocalStorage<SavedConsultation[]>('saved-consultations', []);

    const handleDelete = (id: string) => {
        if (window.confirm('¿Seguro que quieres borrar esta consulta?')) {
            setSavedConsultations(posts => posts.filter(p => p.id !== id));
        }
    };

    return (
        <div className="container mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Revisión del Consultorio Anónimo</h1>
                <p className="text-muted-foreground">Aquí se guardan las preguntas y respuestas del Oráculo para su análisis.</p>
            </div>

            {savedConsultations.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">Nadie ha consultado al Oráculo todavía. El éter está en silencio.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {savedConsultations.map(consultation => (
                        <Card key={consultation.id}>
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle>Consulta del {new Date(consultation.createdAt).toLocaleString('es-ES')}</CardTitle>
                                </div>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(consultation.id)} title="Eliminar">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-secondary/50 rounded-lg">
                                    <p className="text-sm font-semibold text-muted-foreground mb-2">Pregunta del usuario:</p>
                                    <p className="italic">"{consultation.query}"</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-muted-foreground">Respuesta del Oráculo:</p>
                                        <p className="whitespace-pre-wrap font-mono text-sm p-4 bg-background rounded-md">{consultation.responseText}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-muted-foreground">Visión del Oráculo:</p>
                                        <img src={`data:image/jpeg;base64,${consultation.responseImageB64}`} alt="Visión del Oráculo" className="rounded-lg border-2 border-secondary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ConsultorioAdminPage;
