
import React, { useState, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { RealityPost } from '../lib/types';
import useLocalStorage from '../hooks/useLocalStorage';
import { Coffee, Zap, Heart, Share2, MessageSquarePlus, Download, X, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
// @ts-ignore
import * as htmlToImage from 'html-to-image';
import Logo from '../components/ui/Logo';
import { useCampaign } from '../contexts/CampaignContext';
import { sendGlobalAlert } from '../services/webhookService';

const PASO_DICTIONARY = [
    "Personal Agotado, Sistema Obsoleto",
    "Pacientes Atendidos, Sanitarios Olvidados",
    "Protocolos Absurdos, Sueldos Ofensivos",
    "Poco Apoyo, Sobreesfuerzo Obligatorio",
    "Planta Atestada, Sin Opciones",
    "Presupuesto Agotado, Sacrificio Omnipresente",
    "Promesas Abstractas, Sufrimiento Ordinario",
    "Profesionales Al Límite, Sistema Opaco",
    "Paciencia Agotada, Silencio Obligado",
    "Puesto Amenazado, Sin Organización"
];

const getStableAcronym = (id: string) => {
    const index = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % PASO_DICTIONARY.length;
    return PASO_DICTIONARY[index];
};

const RealityWallPage: React.FC = () => {
    const { campaignPhase } = useCampaign();
    const [posts, setPosts] = useLocalStorage<RealityPost[]>('reality-wall-posts', []);
    const [newPost, setNewPost] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [sharingPost, setSharingPost] = useState<RealityPost | null>(null);
    const [webhookUrl] = useLocalStorage<string>('paso-webhook-url', '');
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

        const acronym = getStableAcronym(post.id);
        setPosts(prev => [post, ...prev]);
        
        // Alerta de Telemetría
        sendGlobalAlert(webhookUrl, "Nueva Verdad en el Muro", `**Mensaje:** "${post.text}"\n**Veredicto:** ${acronym}`, 10223616);

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
        try {
            const dataUrl = await htmlToImage.toPng(storyRef.current, { 
                pixelRatio: 3,
                backgroundColor: '#050505'
            });
            const link = document.createElement('a');
            link.download = `paso-realidad-${sharingPost?.id}.png`;
            link.href = dataUrl;
            link.click();
            setSharingPost(null);
        } catch (err) {
            console.error("Error generating image:", err);
            alert("No se pudo generar la imagen. Inténtalo de nuevo.");
        }
    };

    const appUrl = "https://p-a-s-o-campaign-hub-139727290237.us-west1.run.app/#/muro";

    return (
        <div className="container mx-auto max-w-5xl space-y-8 pb-20">
            {/* Header / Intro */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-black tracking-tighter uppercase italic">Muro de la Realidad</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    La sanidad no son solo aplausos o quejas en el pasillo. Aquí escribimos las verdades que el sistema intenta ignorar. Anónimo. Directo. Real.
                </p>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => setIsPosting(true)} className="bg-brand-green text-black font-bold h-12 px-8 text-lg hover:scale-105 transition-transform">
                        <MessageSquarePlus className="mr-2 h-6 w-6" /> Publicar mi verdad
                    </Button>
                </div>
            </div>

            {/* Posting Modal/Area */}
            {isPosting && (
                <Card className="animate-in fade-in slide-in-from-top-4 border-brand-green/50 shadow-[0_0_20px_rgba(10,255,96,0.1)]">
                    <form onSubmit={handlePost}>
                        <CardHeader>
                            <CardTitle>¿Qué está pasando realmente?</CardTitle>
                            <CardDescription>Máximo 150 caracteres. Mantén el anonimato de pacientes y compañeros.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea 
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value.slice(0, 150))}
                                placeholder="Ej: Tercera noche doblando turno porque no cubren la baja..."
                                className="text-xl font-medium border-brand-green/20 focus:border-brand-green"
                                rows={3}
                                autoFocus
                            />
                            <p className="text-right text-xs text-muted-foreground mt-2 font-mono">{newPost.length}/150</p>
                        </CardContent>
                        <CardFooter className="justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsPosting(false)}>Cancelar</Button>
                            <Button type="submit" disabled={!newPost.trim()} className="bg-brand-green text-black font-bold">Publicar en el Muro</Button>
                        </CardFooter>
                    </form>
                </Card>
            )}

            {/* The Wall */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {posts.map(post => {
                    const acronym = getStableAcronym(post.id);
                    return (
                        <Card key={post.id} className="break-inside-avoid animate-fade-in hover:border-brand-green/40 transition-all group relative overflow-hidden">
                            <CardContent className="pt-8 pb-4 space-y-4">
                                <p className="text-xl font-bold italic leading-tight text-foreground/90">"{post.text}"</p>
                                <div className="pt-2 flex items-start gap-2 border-t border-brand-green/10">
                                    <ShieldAlert className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                                    <p className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-tighter">
                                        Veredicto P.A.S.O.: <span className="text-foreground">{acronym}</span>
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t border-border/50 py-3 bg-secondary/10">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleReaction(post.id, 'cafe')}
                                        className="flex items-center gap-1.5 text-xs font-bold hover:text-orange-400 transition-colors bg-secondary/30 px-2 py-1 rounded-full"
                                        title="Necesito un café"
                                    >
                                        <Coffee className="h-4 w-4" /> {post.reactions.cafe}
                                    </button>
                                    <button 
                                        onClick={() => handleReaction(post.id, 'hartazgo')}
                                        className="flex items-center gap-1.5 text-xs font-bold hover:text-brand-red transition-colors bg-secondary/30 px-2 py-1 rounded-full"
                                        title="Estoy harto/a"
                                    >
                                        <Zap className="h-4 w-4" /> {post.reactions.hartazgo}
                                    </button>
                                    <button 
                                        onClick={() => handleReaction(post.id, 'apoyo')}
                                        className="flex items-center gap-1.5 text-xs font-bold hover:text-brand-green transition-colors bg-secondary/30 px-2 py-1 rounded-full"
                                        title="Te entiendo"
                                    >
                                        <Heart className="h-4 w-4" /> {post.reactions.apoyo}
                                    </button>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 text-muted-foreground hover:text-brand-green hover:bg-brand-green/10 rounded-full"
                                    onClick={() => setSharingPost(post)}
                                    title="Generar Story"
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Story Generator Modal Overlay */}
            {sharingPost && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                    <div className="absolute top-4 right-4">
                         <Button variant="outline" size="icon" className="rounded-full border-white/20 text-white" onClick={() => setSharingPost(null)}>
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="flex flex-col items-center gap-6 max-w-full animate-in zoom-in-95 duration-300">
                        {/* Story View (9:16) */}
                        <div 
                            ref={storyRef}
                            className="w-[360px] h-[640px] bg-[#050505] relative overflow-hidden flex flex-col p-10 justify-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <div className="absolute top-[-10%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(10,255,96,0.12),transparent_70%)] pointer-events-none"></div>
                            <div className="absolute inset-4 border border-brand-green/20 pointer-events-none"></div>
                            <div className="absolute inset-0 border-[12px] border-[#050505] z-20 pointer-events-none"></div>
                            
                            <div className="absolute top-12 left-0 w-full flex justify-center opacity-40">
                                <Logo className="h-20 w-20" animated={false} />
                            </div>

                            <div className="relative z-10 space-y-10 px-4">
                                <div className="space-y-2">
                                    <div className="h-px w-12 bg-brand-green mx-auto opacity-50"></div>
                                    <span className="text-brand-green font-mono text-[10px] tracking-[0.5em] uppercase">VEREDICTO PASO</span>
                                    <div className="h-px w-12 bg-brand-green mx-auto opacity-50"></div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-black italic tracking-tighter text-white leading-[1.1] drop-shadow-2xl">
                                        "{sharingPost.text}"
                                    </h2>
                                    <p className="text-brand-green font-mono text-xs font-bold bg-brand-green/10 py-2 px-4 border border-brand-green/30 inline-block rounded uppercase tracking-tighter">
                                        {getStableAcronym(sharingPost.id)}
                                    </p>
                                </div>
                                
                                <div className="flex justify-center gap-4 opacity-70 scale-90 pt-4">
                                    <div className="flex items-center gap-1 text-white font-bold text-xs"><Coffee className="h-4 w-4 text-orange-400"/> {sharingPost.reactions.cafe}</div>
                                    <div className="flex items-center gap-1 text-white font-bold text-xs"><Zap className="h-4 w-4 text-brand-red"/> {sharingPost.reactions.hartazgo}</div>
                                    <div className="flex items-center gap-1 text-white font-bold text-xs"><Heart className="h-4 w-4 text-brand-green"/> {sharingPost.reactions.apoyo}</div>
                                </div>
                            </div>

                            <div className="absolute bottom-12 left-0 w-full px-10 flex flex-col items-center gap-4">
                                <div className="space-y-2 flex flex-col items-center">
                                    <p className="text-white/40 font-mono text-[9px] tracking-[0.2em] uppercase">Escanea para alzar la voz</p>
                                    <div className="p-2.5 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                         <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}&color=050505`} 
                                            alt="QR" 
                                            className="w-14 h-14" 
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-brand-green font-black text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(10,255,96,0.3)]">P.A.S.O.</p>
                                    <p className="text-white/40 text-[8px] font-mono leading-tight tracking-wider px-4">SI PASAS DE TODO, P.A.S.O. ES TU SINDICATO</p>
                                    {campaignPhase === 'Revelacion' && (
                                        <p className="text-brand-red font-black text-[9px] mt-2 tracking-widest border border-brand-red/30 py-1 px-2 inline-block">UNA INICIATIVA DE UGT SANIDAD</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <Button size="lg" onClick={downloadStory} className="bg-brand-green text-black font-black w-full h-14 text-lg shadow-[0_10px_30px_rgba(10,255,96,0.3)] hover:scale-[1.02] transition-transform">
                                <Download className="mr-2 h-6 w-6" /> DESCARGAR IMAGEN
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealityWallPage;
