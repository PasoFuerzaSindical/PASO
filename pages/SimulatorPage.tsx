
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { initManagerChat, replyToManager } from '../services/geminiService';
import { SimulatorMessage, SimulatorTurnResult } from '../lib/types';
import { Send, User, Bot, Frown, Smile, RefreshCcw, Briefcase, Users } from 'lucide-react';
import { Chat } from '@google/genai';
import { cn } from '../lib/utils';
import Loader from '../components/Loader';
import useLocalStorage from '../hooks/useLocalStorage';
import { useCampaign } from '../contexts/CampaignContext';

const SimulatorPage: React.FC = () => {
    const { campaignPhase } = useCampaign();
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<SimulatorMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [gameState, setGameState] = useState({ patience: 50, dignity: 100 });
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'idle'>('idle');
    const [objective] = useLocalStorage<string>('simulator-objective', 'Conseguir un día de libre disposición (moscoso)');
    
    const scrollRef = useRef<HTMLDivElement>(null);

    // Solo mostrar la marca UGT explícitamente en la fase final
    const isRevelacion = campaignPhase === 'Revelacion';

    const startGame = async () => {
        setLoading(true);
        try {
            // Pasa la fase actual para ajustar el prompt interno
            const chat = initManagerChat(objective, campaignPhase);
            setChatSession(chat);
            setMessages([{ role: 'model', text: "Identifíquese. El sistema está procesando su solicitud de entrada. ¿Cuál es el motivo de su interrupción protocolaria?" }]);
            setGameState({ patience: 50, dignity: 100 });
            setGameStatus('playing');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chatSession || gameStatus !== 'playing') return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const result: SimulatorTurnResult = await replyToManager(chatSession, userMsg);
            setMessages(prev => [...prev, { role: 'model', text: result.reply }]);
            setGameState({ patience: result.patience, dignity: result.dignity });
            setGameStatus(result.status);
        } catch (err) {
            console.error("Game Error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        // Changed to w-full and removed max-w limits to use full screen width
        // Adjusted height calculation to account for smaller padding in MainLayout (Header 4rem + Padding 1rem approx = 5rem)
        <div className="w-full h-[calc(100vh-5rem)] flex flex-col gap-2">
            <div className="flex flex-col lg:flex-row gap-2 h-full min-h-0">
                
                {/* LEFT PANEL: STATUS */}
                {/* Changed to lg:w-1/2 (50%) to give maximum horizontal space for text */}
                <Card className="lg:w-1/2 flex flex-col h-full overflow-hidden shadow-xl shrink-0 min-h-0">
                    <CardHeader className="flex-shrink-0 bg-secondary/20 border-b border-border py-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="h-5 w-5 text-ugt-red" /> 
                            Simulador del Sistema
                        </CardTitle>
                        <CardDescription className="line-clamp-1 text-xs">Misión: <span className="font-bold text-foreground">{objective}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin min-h-0">
                        {gameStatus === 'idle' ? (
                            <div className="text-center space-y-4 py-10">
                                <p className="text-muted-foreground">Enfréntate a "Don Burocracio". <br/>Recuerda: Suplicar debilita, gritar cansa, pero <strong>reivindicar derechos</strong> asusta al sistema.</p>
                                <Button onClick={startGame} size="lg" className="w-full animate-pulse">Iniciar Trámite</Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span>Paciencia del Sistema</span>
                                        <span className={gameState.patience < 30 ? "text-destructive" : "text-ugt-green"}>{gameState.patience}%</span>
                                    </div>
                                    <div className="h-4 bg-secondary rounded-full overflow-hidden border border-secondary-foreground/20">
                                        <div 
                                            className={cn("h-full transition-all duration-500", gameState.patience < 30 ? "bg-destructive" : "bg-ugt-green")} 
                                            style={{ width: `${gameState.patience}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Si insultas, te ignoran. Si reivindicas, te escuchan.</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span>Tu Dignidad</span>
                                        <span className={gameState.dignity < 30 ? "text-destructive" : "text-blue-400"}>{gameState.dignity}%</span>
                                    </div>
                                    <div className="h-4 bg-secondary rounded-full overflow-hidden border border-secondary-foreground/20">
                                        <div 
                                            className={cn("h-full transition-all duration-500", gameState.dignity < 30 ? "bg-destructive" : "bg-blue-400")} 
                                            style={{ width: `${gameState.dignity}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">No supliques. Exige lo que es tuyo.</p>
                                </div>

                                {gameStatus === 'won' && (
                                    <div className="p-4 bg-ugt-green/20 border border-ugt-green rounded-lg text-center animate-fade-in break-words">
                                        <Smile className="mx-auto h-8 w-8 text-ugt-green mb-2" />
                                        <h3 className="font-bold text-ugt-green text-lg">¡DERECHO RECONOCIDO!</h3>
                                        <p className="text-sm mt-2">Has demostrado que conocer tus derechos y mostrar firmeza es la única llave que abre estas puertas.</p>
                                        <div className="mt-3 pt-3 border-t border-ugt-green/30">
                                            <p className="text-xs font-bold text-foreground flex items-center justify-center gap-1">
                                                <Users className="h-3 w-3" /> Lección aprendida:
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {isRevelacion 
                                                    ? "UGT te da la formación y el respaldo para que esto pase en la vida real."
                                                    : "La acción colectiva y el conocimiento de la norma te dan la fuerza para que esto pase en la vida real."
                                                }
                                            </p>
                                        </div>
                                        <Button onClick={startGame} variant="outline" size="sm" className="mt-4 w-full">Entrenar de Nuevo</Button>
                                    </div>
                                )}

                                {gameStatus === 'lost' && (
                                    <div className="p-4 bg-destructive/20 border border-destructive rounded-lg text-center animate-fade-in break-words">
                                        <Frown className="mx-auto h-8 w-8 text-destructive mb-2" />
                                        <h3 className="font-bold text-destructive text-lg">SOLICITUD ARCHIVADA</h3>
                                        <p className="text-sm mt-2">
                                            {gameState.patience <= 0 
                                                ? "Perder los nervios no sirve. El sistema es sordo a los gritos, pero escucha las leyes."
                                                : "Suplicar no funciona. El sistema no tiene corazón, tiene normas."}
                                        </p>
                                        <div className="mt-3 pt-3 border-t border-destructive/30">
                                            <p className="text-xs font-bold text-foreground">No vayas solo la próxima vez.</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {isRevelacion
                                                    ? "Un delegado de UGT habría desbloqueado esta situación."
                                                    : "Un compañero bien informado o un representante habría desbloqueado esta situación."
                                                }
                                            </p>
                                        </div>
                                        <Button onClick={startGame} variant="outline" size="sm" className="mt-4 w-full">Reintentar</Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT PANEL: CHAT */}
                {/* Also 50% width on large screens */}
                <Card className="flex-1 lg:w-1/2 flex flex-col h-[60vh] lg:h-full relative overflow-hidden shadow-xl min-w-0">
                    <CardHeader className="flex-shrink-0 bg-secondary/20 border-b border-border py-3">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Conexión Segura</span>
                             </div>
                             {gameStatus !== 'idle' && (
                                <Button variant="ghost" size="sm" onClick={startGame} className="h-6 text-xs" title="Reiniciar">
                                    <RefreshCcw className="h-3 w-3 mr-1" /> Reset
                                </Button>
                             )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin min-h-0" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn("flex gap-3 animate-fade-in", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg",
                                    msg.role === 'user' ? "bg-blue-600" : "bg-ugt-red"
                                )}>
                                    {msg.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-lg max-w-[85%] text-sm shadow-md leading-relaxed",
                                    msg.role === 'user' ? "bg-blue-600/20 border border-blue-600/30 text-foreground rounded-tr-none" : "bg-secondary border border-border text-foreground rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-ugt-red flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="bg-secondary p-3 rounded-lg rounded-tl-none">
                                    <div className="flex gap-1">
                                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></span>
                                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce delay-100"></span>
                                        <span className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-4 border-t border-border bg-secondary/10">
                        <form onSubmit={handleSend} className="flex gap-2 w-full">
                            <Input 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)} 
                                placeholder={gameStatus === 'playing' ? "Escribe tu argumento..." : "Juego terminado"}
                                disabled={gameStatus !== 'playing' || loading}
                                className="flex-1 bg-background"
                            />
                            <Button type="submit" disabled={gameStatus !== 'playing' || loading}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default SimulatorPage;
