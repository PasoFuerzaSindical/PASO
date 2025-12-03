
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BingoTile, DiplomaContent } from '../lib/types';
import { cn } from '../lib/utils';
import { Award, AlertTriangle } from 'lucide-react';
import { generateBingoPhrases, generateDiplomaContent } from '../services/geminiService';
import Loader from '../components/Loader';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/Alert';
import useLocalStorage from '../hooks/useLocalStorage';
import { useCampaign } from '../contexts/CampaignContext';
// @ts-ignore - htmlToImage is imported from CDN
import * as htmlToImage from 'html-to-image';

// Updated to 4x4 Grid (16 tiles)
const generateBingoCard = (phrases: string[]): BingoTile[][] => {
    const shuffled = [...phrases].sort(() => 0.5 - Math.random());
    const card: BingoTile[][] = [];
    // 4 rows
    for (let i = 0; i < 4; i++) {
        const row: BingoTile[] = [];
        // 4 columns
        for (let j = 0; j < 4; j++) {
            // No center free space needed for 4x4
            if (shuffled.length > 0) {
                row.push({
                    text: shuffled.pop()!,
                    marked: false
                });
            } else {
                // Fallback just in case
                row.push({ text: "...", marked: false });
            }
        }
        card.push(row);
    }
    return card;
};

const checkWin = (card: BingoTile[][]): boolean => {
    const size = 4;
    // Check rows and columns
    for (let i = 0; i < size; i++) {
        if (card[i].every(tile => tile.marked)) return true;
        if (card.every(row => row[i].marked)) return true;
    }
    // Check diagonals
    if (card.every((row, i) => row[i].marked)) return true;
    if (card.every((row, i) => row[size - 1 - i].marked)) return true;
    return false;
};

const BingoPage: React.FC = () => {
    const [card, setCard] = useState <BingoTile[][] | null>(null);
    const [hasWon, setHasWon] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingPrize, setIsGeneratingPrize] = useState(false);
    const [diplomaContent, setDiplomaContent] = useState<DiplomaContent | null>(null);
    const [bingoTheme] = useLocalStorage('bingo-theme', 'La Precariedad Cotidiana');
    const { campaignPhase } = useCampaign();

    const bingoCardRef = useRef < HTMLDivElement > (null);
    const prizeRef = useRef < HTMLDivElement > (null);

    const createNewCard = useCallback(async () => {
        setLoading(true);
        setError(null);
        setHasWon(false);
        setDiplomaContent(null);
        try {
            const phrases = await generateBingoPhrases(bingoTheme, campaignPhase);
            setCard(generateBingoCard(phrases));
        } catch (err) {
            setError("La IA no está inspirada para crear nuevas desgracias. Inténtalo más tarde.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [bingoTheme, campaignPhase]);

    useEffect(() => {
        createNewCard();
    }, [createNewCard]);

    const handleTileClick = (rowIndex: number, colIndex: number) => {
        if (hasWon || !card) return;
        const newCard = card.map(row => [...row]);
        newCard[rowIndex][colIndex].marked = !newCard[rowIndex][colIndex].marked;
        setCard(newCard);
    };

    const downloadCard = useCallback(() => {
        if (bingoCardRef.current === null) {
            return;
        }
        htmlToImage.toPng(bingoCardRef.current, {
                cacheBust: true,
                backgroundColor: '#262a33'
            })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `bingo-precariado-${bingoTheme.toLowerCase().replace(/\s/g, '-')}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('oops, something went wrong!', err);
            });
    }, [bingoCardRef, bingoTheme]);

    const downloadPrize = useCallback(() => {
        if (prizeRef.current === null) {
            return;
        }
        htmlToImage.toPng(prizeRef.current, {
                cacheBust: true,
                backgroundColor: '#313642' 
            })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `diploma-paso-${bingoTheme.toLowerCase().replace(/\s/g, '-')}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('oops, something went wrong!', err);
            });
    }, [prizeRef, bingoTheme]);

    useEffect(() => {
        if (!hasWon && card && checkWin(card)) {
            const generatePrize = async () => {
                setIsGeneratingPrize(true);
                try {
                    const content = await generateDiplomaContent(bingoTheme, campaignPhase);
                    setDiplomaContent(content);
                    setHasWon(true);
                } catch (e) {
                    console.error("Failed to generate diploma:", e);
                    // Fallback content in case of AI error
                    setDiplomaContent({ 
                        title: "Certificado de Resiliencia Cósmica", 
                        body: "Has sobrevivido no solo a la precariedad del tema de hoy, sino también a un fallo de la IA. Tu capacidad para aguantar es legendaria." 
                    });
                    setHasWon(true);
                } finally {
                    setIsGeneratingPrize(false);
                }
            };
            generatePrize();
        }
    }, [card, hasWon, bingoTheme, campaignPhase]);
    
    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl text-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Bingo del Precariado: <span className="text-ugt-red">{bingoTheme}</span></CardTitle>
                        <CardDescription>Buscando nuevas formas de ilustrar la desdicha...</CardDescription>
                    </CardHeader>
                    <CardContent className="h-96 flex items-center justify-center">
                        <Loader text="Generando cartón temático..." />
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (error) {
         return (
             <div className="container mx-auto max-w-lg text-center">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error de Inspiración</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={createNewCard} variant="outline" className="mt-4">
                    Intentar de Nuevo
                </Button>
            </div>
         );
    }

    if (isGeneratingPrize) {
        return (
            <div className="container mx-auto max-w-2xl text-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl text-ugt-green">¡BINGO!</CardTitle>
                    </CardHeader>
                     <CardContent className="h-96 flex items-center justify-center">
                        <Loader text="Creando tu merecido (y sarcástico) premio..." />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (hasWon && diplomaContent) {
        return (
             <div className="container mx-auto max-w-2xl text-center">
                 <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle className="text-3xl text-ugt-green">¡BINGO!</CardTitle>
                        <CardDescription>
                            ¡Enhorabuena! Has completado una línea sobre "{bingoTheme}". No ganas nada, pero al menos sabes que no estás solo. ¿Quizás es hora de cambiar las reglas del juego?
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div ref={prizeRef} className="bg-secondary/30 p-8 border-2 border-dashed border-ugt-green rounded-lg text-foreground">
                            <div className="flex flex-col items-center text-center space-y-4">
                                 <Award className="mx-auto h-16 w-16 text-ugt-green" />
                                 <h2 className="text-3xl font-bold text-ugt-green">{diplomaContent.title}</h2>
                                 <p className="text-sm text-muted-foreground">Otorgado a:</p>
                                 <p className="font-semibold text-lg border-b-2 border-muted-foreground/50 pb-1 px-8">Un/a Profesional Sanitario/a Anónimo/a</p>
                                 <p className="max-w-prose">
                                     {diplomaContent.body}
                                 </p>
                                 <div className="pt-6 w-full">
                                    <p className="font-bold text-sm">Firmado con resignación,</p>
                                    <p className="font-serif text-lg text-ugt-red/80 mt-2">- El Sindicato P.A.S.O.</p>
                                    <p className="text-sm text-foreground mt-6 border-t border-muted-foreground/30 pt-4">
                                        Si pasas de todo, sigue a tu P.A.S.O. Si quieres soluciones, <span className="font-bold text-ugt-red">UGT es tu sindicato.</span>
                                    </p>
                                 </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <Button onClick={createNewCard} variant="outline">Jugar de Nuevo</Button>
                        <Button onClick={downloadPrize} variant="accent">Descargar "Premio"</Button>
                    </CardFooter>
                </Card>
             </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl text-center">
            <Card>
                <CardHeader>
                    <CardTitle>Bingo del Precariado: <span className="text-ugt-red">{bingoTheme}</span></CardTitle>
                    <CardDescription>
                        Completa una línea. Desgracia compartida, risa conseguida.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div ref={bingoCardRef} className="grid grid-cols-4 gap-2 p-4 bg-background">
                        {card && card.map((row, rowIndex) =>
                            row.map((tile, colIndex) => (
                                <button
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => handleTileClick(rowIndex, colIndex)}
                                    className={cn(
                                        "aspect-square flex items-center justify-center p-2 text-center text-[10px] sm:text-xs leading-tight font-medium border rounded-md transition-all active:scale-95 break-words overflow-hidden select-none",
                                        tile.marked
                                            ? "bg-ugt-green text-black font-bold border-ugt-green shadow-[0_0_10px_rgba(10,255,96,0.4)]"
                                            : "bg-secondary/50 border-secondary hover:bg-secondary/80 hover:border-white/20 text-muted-foreground hover:text-white"
                                    )}
                                >
                                    {tile.text}
                                </button>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="mt-6 flex justify-center space-x-4">
                <Button onClick={createNewCard} variant="outline">Nuevo Cartón</Button>
                <Button onClick={downloadCard} variant="accent">Descargar</Button>
            </div>
        </div>
    );
};

export default BingoPage;
