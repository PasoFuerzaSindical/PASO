
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { RealityPost } from '../lib/types';
import useLocalStorage from '../hooks/useLocalStorage';
import { Coffee, Zap, Heart, Share2, MessageSquarePlus, Download, X } from 'lucide-react';
import { cn } from '../lib/utils';
// @ts-ignore
import * as htmlToImage from 'html-to-image';
import Logo from '../components/ui/Logo';
import { useCampaign } from '../contexts/CampaignContext';

const RealityWallPage: React.FC = () => {
    const { campaignPhase } = useCampaign();
    const [posts, setPosts] = useLocalStorage<RealityPost[]>('reality-wall-posts', []);
    const [newPost, setNewPost] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [sharingPost, setSharingPost] = useState<RealityPost | null>(null);
    const storyRef = useRef<HTMLDivElement>(null);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const post: RealityPost = {
            id: Date.now().toString(),
            text: newPost.trim(),
            reactions: { cafe: 0, hartazgo: 0, apoyo: 0 },
            createdAt: new Date().toISOString()
        };

        setPosts(prev => [post, ...prev]);
        setNewPost('');
        setIsPosting(false);
    };

    const handleReaction = (postId: string, type: keyof RealityPost['reactions']) => {
        setPosts(prev => prev.map(p => 
            p.id === postId 
                ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } }
                : p
        ));
    };

    const downloadStory = async () => {
        if (!storyRef.current) return;
        const dataUrl = await htmlToImage.toPng(storyRef.current, { 
            pixelRatio: 3,
            backgroundColor: '#050505'
        });
        const link = document.createElement('a');
        link.download = `paso-realidad-${sharingPost?.id}.png`;
        link.href = dataUrl;
        link.click();
        setSharingPost(null);
    };

    // La URL base de la aplicación para el QR
    const appUrl = window.location.origin + window.location.pathname;

    return (
        <div className="container mx-auto max-w-5xl space-y-8 pb-20">
            {/* Header / Intro */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Muro de la Realidad</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    La sanidad no son solo aplausos o quejas en el pasillo. Aquí escribimos las verdades que el sistema intenta ignorar. Anónimo. Directo. Real.
                </p>
                <Button onClick={() => setIsPosting(true)} className="bg-brand-green text-black font-bold">
                    <MessageSquarePlus className="mr-2 h-5 w-5" /> Publicar mi verdad
                </Button>
            </div>

            {/* Posting Modal/Area */}
            {isPosting && (
                <Card className="animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handlePost}>
                        <CardHeader>
                            <CardTitle>¿Qué está pasando realmente?</CardTitle>
                            <CardDescription>Máximo 150 caracteres. Mantengamos el anonimato del paciente, pero no la crudeza de la realidad.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea 
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value.slice(0, 150))}
                                placeholder="Ej: Tercera noche doblando turno porque no cubren la baja..."
                                className="text-lg font-medium"
                                rows={3}
                                autoFocus
                            />
                            <p className="text-right text-xs text-muted-foreground mt-2">{newPost.length}/150</p>
                        </CardContent>
                        <CardFooter className="justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsPosting(false)}>Cancelar</Button>
                            <Button type="submit" disabled={!newPost.trim()}>Publicar</Button>
                        </CardFooter>
                    </form>
                </Card>
            )}

            {/* The Wall */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {posts.map(post => (
                    <Card key={post.id} className="break-inside-avoid animate-fade-in hover:border-brand-green/40 transition-all group">
                        <CardContent className="pt-6">
                            <p className="text-lg font-medium italic leading-tight">"{post.text}"</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t border-border/50 py-3 bg-secondary/10">
                            <div className="flex gap-1">
                                <button 
                                    onClick={() => handleReaction(post.id, 'cafe')}
                                    className="flex items-center gap-1 text-xs hover:text-orange-400 transition-colors"
                                >
                                    <Coffee className="h-4 w-4" /> {post.reactions.cafe}
                                </button>
                                <button 
                                    onClick={() => handleReaction(post.id, 'hartazgo')}
                                    className="flex items-center gap-1 text-xs hover:text-brand-red transition-colors"
                                >
                                    <Zap className="h-4 w-4" /> {post.reactions.hartazgo}
                                </button>
                                <button 
                                    onClick={() => handleReaction(post.id, 'apoyo')}
                                    className="flex items-center gap-1 text-xs hover:text-brand-green transition-colors"
                                >
                                    <Heart className="h-4 w-4" /> {post.reactions.apoyo}
                                </button>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-brand-green"
                                onClick={() => setSharingPost(post)}
                                title="Generar Story para Redes"
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Story Generator Modal Overlay */}
            {sharingPost && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="absolute top-4 right-4 flex gap-2">
                         <Button variant="outline" size="icon" onClick={() => setSharingPost(null)}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="flex flex-col items-center gap-6 max-w-full">
                        {/* Hidden Story View (9:16) */}
                        <div 
                            ref={storyRef}
                            className="w-[360px] h-[640px] bg-[#050505] relative overflow-hidden flex flex-col p-10 justify-center text-center"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(10,255,96,0.1),transparent_70%)] pointer-events-none"></div>
                            <div className="absolute inset-0 border-[10px] border-brand-green/20 pointer-events-none"></div>
                            
                            {/* Logo top */}
                            <div className="absolute top-10 left-0 w-full flex justify-center opacity-50">
                                <Logo className="h-16 w-16" animated={false} />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-6">
                                <span className="text-brand-green font-mono text-xs tracking-[0.3em] uppercase opacity-70">/// REALIDAD PASO ///</span>
                                <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white leading-tight">
                                    "{sharingPost.text}"
                                </h2>
                                <div className="h-1 w-20 bg-brand-red mx-auto"></div>
                            </div>

                            {/* Bottom Info */}
                            <div className="absolute bottom-10 left-0 w-full px-10 flex flex-col items-center gap-2">
                                <p className="text-white/60 font-mono text-xs tracking-widest uppercase">Escanea para unirte:</p>
                                <div className="p-2 bg-white rounded-lg">
                                     <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}`} 
                                        alt="QR de acceso a la campaña" 
                                        className="w-16 h-16" 
                                    />
                                </div>
                                <p className="text-brand-green font-bold text-lg mt-2">P.A.S.O.</p>
                                <p className="text-white/40 text-[9px] font-mono">SI PASAS DE TODO, P.A.S.O. ES TU SINDICATO</p>
                                {campaignPhase === 'Revelacion' && (
                                    <p className="text-brand-red font-bold text-[10px] mt-1">UNA INICIATIVA DE UGT SANIDAD</p>
                                )}
                            </div>
                        </div>

                        <Button size="lg" onClick={downloadStory} className="bg-brand-green text-black font-black w-full shadow-[0_0_20px_rgba(10,255,96,0.4)]">
                            <Download className="mr-2 h-5 w-5" /> DESCARGAR PARA STORY
                        </Button>
                        <p className="text-white/50 text-xs font-mono text-center max-w-[300px]">Súbelo a Instagram o WhatsApp para que otros compañeros puedan unirse.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealityWallPage;
