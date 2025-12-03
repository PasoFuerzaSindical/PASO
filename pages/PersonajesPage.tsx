import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { PenTool, Glasses, Drama } from 'lucide-react';

const PersonajesPage: React.FC = () => {
    return (
        <div className="container mx-auto space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Personajes de la Campaña</h1>
                <p className="mt-4 text-xl text-muted-foreground">Las caras (y las ojeras) del Sindicato P.A.S.O.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* BEGOÑA SARMIENTO */}
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-3xl">
                            <PenTool className="h-8 w-8 text-ugt-red" />
                            Begoña Sarmiento
                        </CardTitle>
                        <CardDescription className="text-lg">La Veterana Cínica</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-ugt-green mb-2">Perfil Psicológico</h3>
                            <p className="text-muted-foreground">
                                Begoña ha visto de todo. Su paciencia se agotó en la anterior legislatura y ahora funciona con una mezcla de cafeína y sarcasmo puro. Es la maestra del comentario pasivo-agresivo y la ironía quirúrgica. Cree firmemente que la burocracia es una entidad consciente cuyo único objetivo es alimentarse de la voluntad de vivir de los sanitarios. Su humor es seco, directo y a menudo tan sutil que tarda unos segundos en hacer efecto.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-ugt-green mb-2">Apariencia Física</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li><strong>Edad:</strong> Finales de los 40, principios de los 50.</li>
                                <li><strong>Cabello:</strong> Recogido en un moño práctico pero ligeramente caótico, con un mechón gris rebelde que se niega a teñir como símbolo de resistencia.</li>
                                <li><strong>Vestimenta:</strong> Un chaleco de forro polar con el logo de un congreso sindical de 2008 sobre una blusa impecable pero visiblemente cansada. Siempre lleva un bolígrafo detrás de la oreja.</li>
                                <li><strong>Rasgos faciales:</strong> Mirada afilada e inteligente, permanentemente escéptica. Una sonrisa fina que casi nunca llega a los ojos, reservada para los momentos de máxima ironía.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-ugt-green mb-2">Tics y Manierismos</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li>Tamborilea rítmicamente su bolígrafo sobre la mesa mientras escucha a la gerencia.</li>
                                <li>Un parpadeo lento y deliberado cuando oye una frase especialmente absurda.</li>
                                <li>Se ajusta las gafas no para ver mejor, sino como una pausa dramática antes de soltar una verdad incómoda.</li>
                                <li>Suelta un "mm-hm" afirmativo que significa inequívocamente "sigue hablando, que me estoy divirtiendo mucho".</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-ugt-green mb-2">Prompt para Generación de Imagen</h3>
                            <pre className="text-xs bg-secondary/50 p-3 rounded-md whitespace-pre-wrap font-mono">
                                A middle-aged woman, Begoña Sarmiento, a cynical union delegate, in a hospital hallway. Photorealistic style. She has sharp, intelligent eyes, a sarcastic thin smile. Her hair is in a slightly messy but professional bun with a defiant grey streak. She wears a faded fleece vest over a tired blouse, with a pen tucked behind her ear. The lighting is sterile, fluorescent. She is looking directly at the camera with a deadpan expression.
                            </pre>
                        </div>
                    </CardContent>
                </Card>

                {/* JACINTO CIFUENTES */}
                <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-3xl">
                            <Drama className="h-8 w-8 text-ugt-red" />
                            Jacinto Cifuentes
                        </CardTitle>
                        <CardDescription className="text-lg">El Mártir Teatral</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-ugt-green mb-2">Perfil Psicológico</h3>
                            <p className="text-muted-foreground">
                                Jacinto vive la lucha sindical como una tragicomedia de la que es el protagonista. Su arma es la hipérbole y el dramatismo. Cada nuevo recorte de personal es una "puñalada al corazón de la sanidad pública", cada nuevo protocolo es "un laberinto diseñado por el Minotauro". Es un coleccionista de agravios y puede citar de memoria normativas oscuras de 1993. Su humor no es sutil, es una performance completa, diseñada para exponer el absurdo a través del exceso.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-ugt-green mb-2">Apariencia Física</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li><strong>Edad:</strong> Principios de los 50.</li>
                                <li><strong>Cabello:</strong> Entradas pronunciadas que intenta disimular con un peinado estratégico. Un bigote poblado y cuidado que se desanima visiblemente con cada mala noticia.</li>
                                <li><strong>Vestimenta:</strong> Una americana de pana con coderas desgastadas sobre una camisa ligeramente arrugada. Su corbata tiene una mancha de café perenne que él considera una "herida de guerra".</li>
                                <li><strong>Rasgos faciales:</strong> Ojos grandes y expresivos, a menudo abiertos de par en par con falsa incredulidad. Arrugas de expresión marcadas por años de suspirar.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-ugt-green mb-2">Tics y Manierismos</h3>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li>Un suspiro largo y sonoro que precede a casi todas sus intervenciones.</li>
                                <li>Se limpia las gafas con la corbata mientras reflexiona sobre "la deriva del sistema".</li>
                                <li>Levanta una ceja tan alto que casi se fusiona con su línea de cabello.</li>
                                <li>Se lleva la mano al pecho, como si sufriera un dolor agudo, al oír la palabra "optimización".</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-ugt-green mb-2">Prompt para Generación de Imagen</h3>
                            <pre className="text-xs bg-secondary/50 p-3 rounded-md whitespace-pre-wrap font-mono">
                                A middle-aged man, Jacinto Cifuentes, a theatrical union delegate, in a cluttered office. Photorealistic, slightly dramatic lighting. He has a magnificent mustache that droops with exasperation, and a receding hairline. He wears a corduroy blazer with worn elbow patches. He is captured mid-sigh, polishing his glasses with his tie, his eyes wide with feigned shock at a stack of paperwork.
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PersonajesPage;
