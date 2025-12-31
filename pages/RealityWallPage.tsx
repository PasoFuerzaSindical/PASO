
import React, { useState, useRef, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { RealityPost } from '../lib/types';
import useLocalStorage from '../hooks/useLocalStorage';
import { Coffee, Zap, Heart, Share2, MessageSquarePlus, Download, X, ShieldAlert, Square, Smartphone } from 'lucide-react';
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

type AspectRatio = '9:16' | '4:5';

const RealityWallPage: React.FC = () => {
    const { campaignPhase } = useCampaign();
    const [posts, setPosts] = useLocalStorage<RealityPost[]>('reality-wall-posts', []);
    const [newPost, setNewPost] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [sharingPost, setSharingPost] = useState<RealityPost | null>(null);
    const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('9:16');
    
    // Defaulting to user's provided webhook
    const [webhookUrl] = useLocalStorage<string>('paso-webhook-url', 'https://discord.com/api/webhooks/1455616560440938744/4sG3-kIsF6blUl001FNCJmBb8dIaBPDDQHOK73k8qJUbFZdfnW8CU0OtYC2G7_sw8nX_');
    
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
        
        // Alerta de Telemetría con Acrónimo incluido
        sendGlobalAlert(webhookUrl, "Nueva Verdad en el Muro", `**Mensaje:** "${post.text}"\n**Veredicto P.A.S.O.:** ${acronym}`, 10223616);

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
            link.download = `paso-realidad-${selectedRatio.replace(':', '-')}-${sharingPost?.id}.png`;
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
                <h1 className="text-4xl font-black tracking-tighter uppercase italic text-brand-green">Muro de la Realidad</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm uppercase tracking-widest">
                    La sanidad no son solo aplausos o quejas en el pasillo. Aquí escribimos las verdades que el sistema intenta ignorar.
                </p>
                <div className="flex justify-center gap-4">
                    <Button onClick={() => setIsPosting(true)} className="bg-brand-green text-black font-black h-12 px-8 text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(10,255,96,0.3)]">
                        <MessageSquarePlus className="mr-2 h-6 w-6" /> PUBLICAR MI VERDAD
                    </Button>
                </div>
            </div>

            {/* Posting Modal/Area */}
            {isPosting && (
                <Card className="animate-in fade-in slide-in-from-top-4 border-brand-green/50 shadow-[0_0_30px_rgba(10,255,96,0.1)] bg-black/60 backdrop-blur-xl">
                    <form onSubmit={handlePost}>
                        <CardHeader>
                            <CardTitle className="text-brand-green">¿QUÉ ESTÁ PASANDO REALMENTE?</CardTitle>
                            <CardDescription className="font-mono text-[10px] uppercase">Máximo 150 caracteres. Mantén el anonimato de pacientes y compañeros.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea 
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value.slice(0, 150))}
                                placeholder="Ej: Tercera noche doblando turno porque no cubren la baja..."
                                className="text-xl font-bold border-brand-green/20 focus:border-brand-green bg-black/40 text-foreground"
                                rows={3}
                                autoFocus
                            />
                            <p className="text-right text-[10px] text-brand-green/50 mt-2 font-mono uppercase tracking-tighter">{newPost.length}/150 CHARS</p>
                        </CardContent>
                        <CardFooter className="justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsPosting(false)} className="font-bold uppercase text-xs">Cancelar</Button>
                            <Button type="submit" disabled={!newPost.trim()} className="bg-brand-green text-black font-black uppercase">Publicar en el Muro</Button>
                        </CardFooter>
                    </form>
                </Card>
            )}

            {/* The Wall */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {posts.map(post => {
                    const acronym = getStableAcronym(post.id);
                    return (
                        <Card key={post.id} className="break-inside-avoid animate-fade-in hover:border-brand-green/40 transition-all group relative overflow-hidden bg-card/40 backdrop-blur-md">
                            <CardContent className="pt-8 pb-4 space-y-4">
                                <p className="text-xl font-black italic leading-[1.1] text-foreground/90 uppercase tracking-tighter">"{post.text}"</p>
                                <div className="pt-3 flex items-start gap-2 border-t border-brand-green/10">
                                    <ShieldAlert className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                                    <p className="text-[10px] font-mono font-bold text-brand-green uppercase tracking-tighter leading-tight">
                                        VEREDICTO P.A.S.O.: <span className="text-foreground">{acronym}</span>
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t border-border/20 py-3 bg-secondary/5">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleReaction(post.id, 'cafe')}
                                        className="flex items-center gap-1.5 text-[10px] font-black hover:text-orange-400 transition-colors bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-tighter"
                                        title="Necesito un café"
                                    >
                                        <Coffee className="h-4 w-4" /> {post.reactions.cafe}
                                    </button>
                                    <button 
                                        onClick={() => handleReaction(post.id, 'hartazgo')}
                                        className="flex items-center gap-1.5 text-[10px] font-black hover:text-brand-red transition-colors bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-tighter"
                                        title="Estoy harto/a"
                                    >
                                        <Zap className="h-4 w-4" /> {post.reactions.hartazgo}
                                    </button>
                                    <button 
                                        onClick={() => handleReaction(post.id, 'apoyo')}
                                        className="flex items-center gap-1.5 text-[10px] font-black hover:text-brand-green transition-colors bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-tighter"
                                        title="Te entiendo"
                                    >
                                        <Heart className="h-4 w-4" /> {post.reactions.apoyo}
                                    </button>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-muted-foreground hover:text-brand-green hover:bg-brand-green/10 rounded-full"
                                    onClick={() => setSharingPost(post)}
                                    title="Generar Story/Post"
                                >
                                    <Share2 className="h-4 w-4" />
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
                        
                        {/* Format Selector Toggle */}
                        <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex gap-1">
                            <Button 
                                variant={selectedRatio === '9:16' ? 'default' : 'ghost'} 
                                size="sm" 
                                className={cn("h-10 px-4 rounded-lg flex items-center gap-2", selectedRatio === '9:16' ? "bg-brand-green text-black" : "text-white/60")}
                                onClick={() => setSelectedRatio('9:16')}
                            >
                                <Smartphone className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Story (9:16)</span>
                            </Button>
                            <Button 
                                variant={selectedRatio === '4:5' ? 'default' : 'ghost'} 
                                size="sm" 
                                className={cn("h-10 px-4 rounded-lg flex items-center gap-2", selectedRatio === '4:5' ? "bg-brand-green text-black" : "text-white/60")}
                                onClick={() => setSelectedRatio('4:5')}
                            >
                                <Square className="h-4 w-4" />
                                <span className="text-[10px] font-black uppercase tracking-tighter">Feed (4:5)</span>
                            </Button>
                        </div>

                        {/* Story View (Dynamic Dimensions) */}
                        <div 
                            ref={storyRef}
                            style={{ 
                                width: '360px', 
                                height: selectedRatio === '9:16' ? '640px' : '450px' 
                            }}
                            className="bg-[#050505] relative overflow-hidden flex flex-col p-8 md:p-10 justify-between text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out"
                        >
                            <div className="absolute top-[-10%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,rgba(10,255,96,0.12),transparent_70%)] pointer-events-none"></div>
                            <div className="absolute inset-4 border border-brand-green/20 pointer-events-none"></div>
                            <div className="absolute inset-0 border-[12px] border-[#050505] z-20 pointer-events-none"></div>
                            
                            {/* Logo Top - Less space on 4:5 */}
                            <div className={cn("relative z-10 flex justify-center opacity-40", selectedRatio === '4:5' ? "mt-2" : "mt-4")}>
                                <Logo className={selectedRatio === '4:5' ? "h-14 w-14" : "h-20 w-20"} animated={false} />
                            </div>

                            {/* Message Center */}
                            <div className="relative z-10 space-y-6 md:space-y-8 px-4 flex-1 flex flex-col justify-center">
                                <div className="space-y-2">
                                    <div className="h-px w-12 bg-brand-green mx-auto opacity-50"></div>
                                    <span className="text-brand-green font-mono text-[9px] tracking-[0.4em] uppercase">VEREDICTO PASO</span>
                                    <div className="h-px w-12 bg-brand-green mx-auto opacity-50"></div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h2 className={cn(
                                        "font-black italic tracking-tighter text-white leading-[1.1] drop-shadow-2xl uppercase",
                                        selectedRatio === '4:5' ? "text-2xl" : "text-3xl"
                                    )}>
                                        "{sharingPost.text}"
                                    </h2>
                                    <p className="text-brand-green font-mono text-[10px] font-bold bg-brand-green/10 py-1.5 px-3 border border-brand-green/30 inline-block rounded uppercase tracking-tighter">
                                        {getStableAcronym(sharingPost.id)}
                                    </p>
                                </div>
                                
                                <div className="flex justify-center gap-4 opacity-70 scale-90 pt-2">
                                    <div className="flex items-center gap-1 text-white font-bold text-xs"><Coffee className="h-4 w-4 text-orange-400"/> {sharingPost.reactions.cafe}</div>
                                    <div className="flex items-center gap-1 text-white font-bold text-xs"><Zap className="h-4 w-4 text-brand-red"/> {sharingPost.reactions.hartazgo}</div>
                                    <div className="flex items-center gap-1 text-white font-bold text-xs"><Heart className="h-4 w-4 text-brand-green"/> {sharingPost.reactions.apoyo}</div>
                                </div>
                            </div>

                            {/* Footer Area - Tighter on 4:5 */}
                            <div className={cn("relative z-10 w-full px-4 flex flex-col items-center gap-4", selectedRatio === '4:5' ? "mb-2" : "mb-4")}>
                                <div className="space-y-2 flex flex-col items-center">
                                    <p className="text-white/40 font-mono text-[8px] tracking-[0.2em] uppercase">Escanea para alzar la voz</p>
                                    <div className="p-2 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                         <img 
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(appUrl)}&color=050505`} 
                                            alt="QR" 
                                            className={selectedRatio === '4:5' ? "w-10 h-10" : "w-14 h-14"}
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-0.5">
                                    <p className={cn("text-brand-green font-black tracking-tighter drop-shadow-[0_0_10px_rgba(10,255,96,0.3)]", selectedRatio === '4:5' ? "text-xl" : "text-2xl")}>P.A.S.O.</p>
                                    <p className="text-white/40 text-[7px] font-mono leading-tight tracking-wider px-2">SI PASAS DE TODO, P.A.S.O. ES TU SINDICATO</p>
                                    {campaignPhase === 'Revelacion' && (
                                        <p className="text-brand-red font-black text-[8px] mt-1 tracking-widest border border-brand-red/30 py-0.5 px-2 inline-block uppercase">UNA INICIATIVA DE UGT SANIDAD</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full min-w-[320px]">
                            <Button size="lg" onClick={downloadStory} className="bg-brand-green text-black font-black w-full h-14 text-lg shadow-[0_10px_30px_rgba(10,255,96,0.3)] hover:scale-[1.02] transition-transform">
                                <Download className="mr-2 h-6 w-6" /> DESCARGAR PARA {selectedRatio === '9:16' ? 'STORY' : 'FEED'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealityWallPage;
