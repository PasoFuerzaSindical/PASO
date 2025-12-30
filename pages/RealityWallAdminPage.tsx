
import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { RealityPost } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

const RealityWallAdminPage: React.FC = () => {
    const [posts, setPosts] = useLocalStorage<RealityPost[]>('reality-wall-posts', []);

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            setPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleClearAll = () => {
        if (window.confirm('¿ELIMINAR TODO EL MURO? Esta acción es irreversible y reseteará la indignación acumulada.')) {
            setPosts([]);
        }
    };

    return (
        <div className="container mx-auto space-y-8">
            <div className="flex justify-between items-center border-b border-border pb-4">
                <div>
                    <h1 className="text-3xl font-bold">Gestión del Muro de la Realidad</h1>
                    <p className="text-muted-foreground">Modera las verdades enviadas por los usuarios.</p>
                </div>
                <Button variant="destructive" onClick={handleClearAll} size="sm">
                    <AlertTriangle className="mr-2 h-4 w-4" /> Resetear Muro
                </Button>
            </div>

            {posts.length === 0 ? (
                <Card className="text-center py-20 border-dashed">
                    <CardContent>
                        <p className="text-muted-foreground italic">El muro está vacío. Parece que hoy el sistema funciona... o nadie se atreve a hablar.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {posts.map(post => (
                        <Card key={post.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-secondary/20">
                            <div className="flex-1 space-y-1">
                                <p className="font-medium text-lg italic">"{post.text}"</p>
                                <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                                    <span>ID: {post.id}</span>
                                    <span>Fecha: {new Date(post.createdAt).toLocaleString()}</span>
                                    <span className="text-brand-green">Total Reacciones: {post.reactions.cafe + post.reactions.hartazgo + post.reactions.apoyo}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Card className="bg-brand-green/10 border-brand-green/30">
                <CardHeader>
                    <CardTitle className="text-brand-green flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" /> Consejos de Moderación
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <p>• <strong>Mantén el anonimato:</strong> Borra posts que mencionen nombres reales de pacientes o personal no público.</p>
                    <p>• <strong>Filtra el odio:</strong> Una cosa es la crítica al sistema y otra los ataques personales o discriminatorios.</p>
                    <p>• <strong>Detecta tendencias:</strong> Si muchos posts hablan del mismo problema (ej. "calefacción en Urgencias"), usa esa info para crear un cartel temático o un post en redes.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default RealityWallAdminPage;
