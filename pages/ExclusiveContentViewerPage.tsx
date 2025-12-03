
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { ExclusiveContent } from '../lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { buttonVariants } from '../components/ui/Button';
import { FileQuestion, Download } from 'lucide-react';
import { cn } from '../lib/utils';

const ExclusiveContentViewerPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [contentList] = useLocalStorage<ExclusiveContent[]>('exclusive-content', []);
    const [content, setContent] = useState<ExclusiveContent | undefined>(undefined);

    useEffect(() => {
        if (id) {
            const foundContent = contentList.find(c => c.id === id);
            setContent(foundContent);
        }
    }, [id, contentList]);

    const renderContent = () => {
        if (!content) return null;
        
        const { fileData, fileType, fileName } = content;

        if (fileType.startsWith('image/')) {
            return <img src={fileData} alt={fileName} className="max-w-full rounded-lg mx-auto" />;
        }
        if (fileType.startsWith('audio/')) {
            return <audio controls src={fileData} className="w-full">Tu navegador no soporta el elemento de audio.</audio>;
        }
        if (fileType.startsWith('video/')) {
            return <video controls src={fileData} className="max-w-full rounded-lg mx-auto">Tu navegador no soporta el elemento de video.</video>;
        }
        if (fileType === 'text/plain') {
            const base64Content = fileData.split(',')[1];
            try {
                const text = atob(base64Content);
                return <pre className="whitespace-pre-wrap bg-secondary/50 p-4 rounded-md text-sm">{text}</pre>;
            } catch (e) {
                console.error("Error decoding base64 text:", e);
                return <p className="text-destructive">No se pudo decodificar el archivo de texto.</p>
            }
        }
        
        return (
            <div className="text-center p-6 border-2 border-dashed border-secondary/50 rounded-lg flex flex-col items-center gap-4">
                <p>Este tipo de archivo ({fileName}) no se puede previsualizar directamente.</p>
                <a href={fileData} download={fileName} className={cn(buttonVariants())}>
                    <Download className="h-4 w-4 mr-2" /> Descargar Archivo
                </a>
            </div>
        );
    };

    if (!content) {
        return (
            <div className="container mx-auto max-w-2xl text-center py-20">
                 <Card>
                    <CardHeader>
                        <FileQuestion className="mx-auto h-16 w-16 text-destructive" />
                        <CardTitle className="mt-4">Contenido no Encontrado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">El contenido exclusivo que buscas no existe o ha sido eliminado.</p>
                        <Link to="/" className={cn(buttonVariants({ variant: 'link' }), 'mt-4')}>
                            Volver a la página principal
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl">{content.title}</CardTitle>
                    {content.description && <CardDescription className="pt-2">{content.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                    {renderContent()}
                </CardContent>
            </Card>
        </div>
    );
};

export default ExclusiveContentViewerPage;
