
import React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { CampaignPost } from '../lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trash2, Download } from 'lucide-react';

const GalleryPage: React.FC = () => {
  const [savedPosts, setSavedPosts] = useLocalStorage<CampaignPost[]>('gallery-posts', []);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que quieres borrar esta obra de arte del descontento?')) {
      setSavedPosts(posts => posts.filter(p => p.id !== id));
    }
  };
  
  const handleDownload = (post: CampaignPost) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${post.imageB64}`;
    link.download = `paso-post-${post.id}.jpeg`;
    link.click();
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Galería de la Indignación</h1>
        <p className="text-muted-foreground">Aquí se archivan nuestras obras maestras de la comunicación de guerrilla.</p>
      </div>

      {savedPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">La galería está vacía. Ve al 'Generador de Contenido' para crear algo miserablemente bello.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedPosts.map(post => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <img src={`data:image/jpeg;base64,${post.imageB64}`} alt="Contenido generado" className="rounded-t-lg aspect-square object-cover" />
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-xs text-muted-foreground">{post.platform} - {new Date(post.createdAt).toLocaleDateString('es-ES')}</p>
                <p className="text-sm mt-2 line-clamp-4">{post.postText}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleDownload(post)} title="Descargar Imagen">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)} title="Eliminar">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
