
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import useLocalStorage from '../hooks/useLocalStorage';
import { ExclusiveContent } from '../lib/types';
import { UploadCloud, Link, Trash2, Copy } from 'lucide-react';
import Loader from '../components/Loader';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const ExclusiveContentAdminPage: React.FC = () => {
    const [contentList, setContentList] = useLocalStorage<ExclusiveContent[]>('exclusive-content', []);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) {
            alert('El título y el archivo son obligatorios.');
            return;
        }
        setLoading(true);
        try {
            const fileData = await fileToBase64(file);
            const newContent: ExclusiveContent = {
                id: Date.now().toString(),
                title,
                description,
                fileData,
                fileType: file.type,
                fileName: file.name,
                createdAt: new Date().toISOString(),
            };
            setContentList(prev => [newContent, ...prev]);
            setTitle('');
            setDescription('');
            setFile(null);
            
            const fileInput = document.getElementById('file-upload') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error("Error creating exclusive content:", error);
            alert("Hubo un error al procesar el archivo.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
            setContentList(prev => prev.filter(c => c.id !== id));
        }
    };

    const getContentUrl = (id: string) => {
        const url = `${window.location.origin}${window.location.pathname}#/content/${id}`;
        return url;
    };
    
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Enlace copiado al portapapeles.');
    };

    return (
        <div className="container mx-auto space-y-8">
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Subir Contenido Exclusivo</CardTitle>
                        <CardDescription>Sube un archivo y genera un QR para que los usuarios puedan acceder a él.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del contenido" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción (opcional)</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción del contenido" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file-upload">Archivo</Label>
                            <Input id="file-upload" type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Loader text="Subiendo..." /> : <><UploadCloud className="h-4 w-4 mr-2" /> Subir y Generar QR</>}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contenido Existente</CardTitle>
                </CardHeader>
                <CardContent>
                    {contentList.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No hay contenido exclusivo todavía.</p>
                    ) : (
                        <div className="space-y-6">
                            {contentList.map(content => {
                                const url = getContentUrl(content.id);
                                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
                                return (
                                    <div key={content.id} className="flex flex-col md:flex-row gap-6 p-4 bg-secondary/50 rounded-lg">
                                        <div className="flex-shrink-0 mx-auto md:mx-0">
                                            <img src={qrUrl} alt={`QR Code for ${content.title}`} className="w-40 h-40 rounded-md border" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h3 className="font-semibold text-lg">{content.title}</h3>
                                            <p className="text-sm text-muted-foreground">{content.description}</p>
                                            <p className="text-xs text-muted-foreground">Subido: {new Date(content.createdAt).toLocaleString('es-ES')}</p>
                                            <div className="flex items-center gap-2 bg-background p-2 rounded-md">
                                                <Link className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                <input type="text" readOnly value={url} className="bg-transparent text-sm w-full outline-none" />
                                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(url)} title="Copiar enlace">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(content.id)} title="Eliminar contenido">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ExclusiveContentAdminPage;
