

import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { SurrealConsultationResult, CampaignPost, PosterContent, DiplomaContent, AcronymGeneratorResult, SimulatorTurnResult } from '../lib/types';
import { CampaignPhase, getSystemInstructionForPhase } from '../lib/campaignGems';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Actualizado a Gemini 3 Pro para mejor razonamiento y manejo del tono irónico
const textModel = 'gemini-3-pro-preview';
const imageModel = 'imagen-4.0-generate-001';

interface SurrealConsultationPayload {
    consultationText: string;
    imagePrompt: string;
}

export const handleSurrealConsultation = async (queryOrAudio: string, campaignPhase: CampaignPhase, isAudio: boolean = false): Promise<SurrealConsultationResult> => {
    try {
        const baseInstruction = `Tu objetivo es ser un Oráculo sindical surrealista para la campaña P.A.S.O. Responde a las consultas con humor, ironía y metáforas abstractas. NO des consejos prácticos. Tu objetivo es ser críptico, inteligente y extrañamente motivador. Al final de tu respuesta, crea un prompt para una imagen que represente tu consejo conceptualmente.`;
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n\n${baseInstruction}`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                consultationText: {
                    type: Type.STRING,
                    description: "La respuesta surrealista e irónica del oráculo."
                },
                imagePrompt: {
                    type: Type.STRING,
                    description: "Un prompt detallado para un generador de imágenes, de estilo conceptual y surrealista, que capture la esencia de la respuesta."
                }
            }
        };

        let contents: any;
        if (isAudio) {
            // queryOrAudio is base64 string of audio
            contents = {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'audio/wav', // Assuming recording produces wav/webm, converting to base64
                            data: queryOrAudio
                        }
                    },
                    {
                        text: "Escucha esta consulta de un sanitario agotado. Analiza su tono de voz (cansancio, ira, resignación) y responde en consecuencia."
                    }
                ]
            };
        } else {
            contents = `Aquí está la consulta del sanitario: "${queryOrAudio}"`;
        }

        const textResponse: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: contents,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const payload: SurrealConsultationPayload = JSON.parse(textResponse.text);

        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: payload.imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            }
        });

        const imageB64 = imageResponse.generatedImages[0].image.imageBytes;

        return {
            text: payload.consultationText,
            imageB64: imageB64,
        };

    } catch (error) {
        console.error("Error in handleSurrealConsultation:", error);
        throw new Error("Failed to get surreal consultation from AI.");
    }
};

interface GenerateSocialPostPayload {
    acronym: string;
    postText: string;
    imagePrompt: string;
}

export const generateSocialPost = async (options: { platform: string; tone: string; campaignPhase: CampaignPhase; theme: string }): Promise<Omit<CampaignPost, 'id' | 'createdAt'>> => {
    try {
        const { platform, tone, campaignPhase, theme } = options;

        let systemInstruction = getSystemInstructionForPhase(campaignPhase);
        let imagePromptAdditions = `Estilo: surrealismo digital, paleta de colores oscuros.`;
        
        const isIntriguePhase = campaignPhase === 'Llegada';

        if (!isIntriguePhase) {
             systemInstruction += ` La campaña está respaldada por UGT, por lo que puedes incluir sutilmente su logo o colores corporativos (rojo #E30613, verde #16a34a) si es apropiado, pero el tono principal debe ser el de P.A.S.O.`;
             imagePromptAdditions = `Estilo: surrealismo digital, paleta de colores oscuros con acentos del rojo corporativo de UGT (#E30613) y un verde profesional y fresco (#16a34a).`;
        } else {
             systemInstruction += ` IMPORTANTE: En la fase de 'Llegada' (Intriga), NO debe aparecer ninguna referencia, logo, color o mención a UGT. El misterio es absoluto.`;
             imagePromptAdditions = `Estilo: surrealismo digital, paleta de colores oscuros y neutros. Evita el color rojo brillante o verde para no dar pistas.`;
        }


        const prompt = `
        Genera una publicación para la campaña P.A.S.O. con las siguientes características:
        - Plataforma: ${platform}
        - Tono: ${tone}
        - Fase de la Campaña: ${campaignPhase}
        - Tema Central: ${theme}

        Tu resultado debe incluir:
        1. Un nuevo significado para el acrónimo P.A.S.O. que sea relevante para el tema.
        2. El texto completo de la publicación, adaptado a la longitud y estilo de la plataforma.
        3. Un prompt de imagen muy detallado, conceptual y surrealista para acompañar la publicación.
        `;
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                acronym: {
                    type: Type.STRING,
                    description: "Un nuevo y creativo significado para el acrónimo P.A.S.O."
                },
                postText: {
                    type: Type.STRING,
                    description: "El texto de la publicación para redes sociales."
                },
                imagePrompt: {
                    type: Type.STRING,
                    description: "Un prompt de imagen detallado, conceptual y artístico."
                }
            }
        };

        const textResponse = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const payload: GenerateSocialPostPayload = JSON.parse(textResponse.text);

        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: `${imagePromptAdditions} ${payload.imagePrompt}`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        const imageB64 = imageResponse.generatedImages[0].image.imageBytes;

        return {
            platform,
            tone,
            campaignPhase,
            theme,
            postText: `P.A.S.O.: ${payload.acronym}\n\n${payload.postText}`,
            imageB64,
            imagePrompt: payload.imagePrompt,
        };
    } catch (error) {
        console.error("Error in generateSocialPost:", error);
        throw new Error("Failed to generate campaign post.");
    }
};

export const generatePosterContent = async (campaignPhase: CampaignPhase): Promise<PosterContent> => {
    try {
        const baseInstruction = "Eres un publicista creativo y mordaz para la campaña sindical P.A.S.O. El objetivo es generar intriga para las próximas elecciones sindicales. El mensaje central debe jugar con el doble sentido de 'PASO' (pasar de votar / el sindicato P.A.S.O.).";
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n\n${baseInstruction}`;
        const prompt = "Crea un set de textos para un cartel de campaña. El tono debe ser de intriga, minimalista y directo. Proporciona un titular, un eslogan principal y un subtítulo o pregunta.";

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING, description: "Un titular corto y llamativo." },
                slogan: { type: Type.STRING, description: "El eslogan principal que incluye la palabra P.A.S.O." },
                subtitle: { type: Type.STRING, description: "Un subtítulo o pregunta final para generar reflexión." },
            },
        };

        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error in generatePosterContent:", error);
        throw new Error("Failed to generate poster content from AI.");
    }
};

export const generateBingoPhrases = async (theme: string, campaignPhase: CampaignPhase): Promise<string[]> => {
    try {
        const baseInstruction = `Tu objetivo es crear frases que generen solidaridad entre TODO el personal sanitario a través del humor y la crítica. IMPORTANTE: Las frases deben ser MUY CORTAS y directas (máximo 5-7 palabras) para que quepan en un cartón de bingo pequeño.`;
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n\n${baseInstruction}`;
        // Requesting 16 phrases for 4x4 grid instead of 24
        const prompt = `Genera una lista de 16 frases cortas, mordaces e irónicas para un cartón de bingo del precariado sanitario (4x4). El tema central es: "${theme}". Ejemplo de longitud: "Café frío y sin azúcar" o "Turno doble sorpresa".`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                phrases: {
                    type: Type.ARRAY,
                    description: "Una lista de 16 frases cortas para el bingo.",
                    items: {
                        type: Type.STRING
                    }
                }
            }
        };

        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            }
        });
        
        const result: { phrases: string[] } = JSON.parse(response.text);
        
        if (!result.phrases || result.phrases.length < 16) {
            throw new Error("AI returned an insufficient number of phrases.");
        }

        return result.phrases;

    } catch (error) {
        console.error("Error in generateBingoPhrases:", error);
        throw new Error("Failed to generate bingo phrases from AI.");
    }
};


export const generateDiplomaContent = async (theme: string, campaignPhase: CampaignPhase): Promise<DiplomaContent> => {
    try {
        const baseInstruction = `Eres un redactor creativo y sarcástico. Debes crear el texto para un diploma irónico que se entrega al ganar el "Bingo del Precariado".`;
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n\n${baseInstruction}`;
        const prompt = `El tema del bingo de esta semana ha sido "${theme}". Genera un título y un cuerpo de texto para el diploma. El título debe ser grandilocuente y divertido. El cuerpo del texto debe felicitar irónicamente al sanitario por "ganar" en un tema tan precario.`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "Un título ingenioso y grandilocuente para el diploma." },
                body: { type: Type.STRING, description: "El texto irónico y de felicitación para el cuerpo del diploma, relacionado con el tema." },
            },
        };

        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error in generateDiplomaContent:", error);
        throw new Error("Failed to generate diploma content from AI.");
    }
};

export const generateCreativeAcronyms = async (
    inputData: string, 
    inputType: 'text' | 'image', 
    campaignPhase: CampaignPhase
): Promise<AcronymGeneratorResult> => {
    try {
        const baseInstruction = `Eres el especialista en branding de guerrilla de P.A.S.O. Tu especialidad es crear significados recursivos, irónicos y mordaces para el acrónimo P.A.S.O. (siempre P.A.S.O., 4 letras) basados en situaciones laborales sanitarias.`;
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n\n${baseInstruction}`;
        
        let prompt = "";
        let contents: any = "";

        if (inputType === 'image') {
            prompt = "Analiza esta imagen. Identifica qué situación precaria, absurda o cansada del ámbito sanitario representa. Basándote en ese análisis visual, genera 5 posibles significados para el acrónimo P.A.S.O. que describan la situación con ironía y humor negro. Incluye también una breve explicación de por qué has elegido esos acrónimos basándote en la imagen.";
            // inputData here is base64
             contents = {
                parts: [
                  {
                    inlineData: {
                      mimeType: 'image/jpeg', 
                      data: inputData, 
                    },
                  },
                  {
                    text: prompt,
                  },
                ],
            };
        } else {
            // Text or PDF content treated as text
            prompt = `Analiza el siguiente texto o tema: "${inputData}".\n\nBasándote en este contexto, genera 5 posibles significados creativos para el acrónimo P.A.S.O. que reflejen la frustración o el absurdo de la situación descrita. Incluye una breve explicación de tu razonamiento sarcástico.`;
            contents = prompt;
        }

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                acronyms: {
                    type: Type.ARRAY,
                    description: "Lista de 5 variaciones creativas del acrónimo P.A.S.O.",
                    items: { type: Type.STRING }
                },
                explanation: {
                    type: Type.STRING,
                    description: "Breve explicación cínica o irónica del análisis realizado para generar estos acrónimos."
                }
            },
        };

        const response = await ai.models.generateContent({
            model: textModel, // gemini-3-pro-preview handles text and images in the updated SDK logic
            contents: contents,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error in generateCreativeAcronyms:", error);
        throw new Error("Failed to generate acronyms.");
    }
};

// --- MANAGER SIMULATOR LOGIC ---

export const initManagerChat = (objective: string = "Conseguir un día de libre disposición (moscoso)", campaignPhase: CampaignPhase = 'Llegada'): Chat => {
    
    // Only explicitly mention UGT in the prompt if we are in the Revelation phase.
    const isRevelacion = campaignPhase === 'Revelacion';
    const unionKeywords = isRevelacion ? "'SINDICATO', 'UGT', 'DELEGADO SINDICAL'" : "'SINDICATO', 'DELEGADO SINDICAL'";

    const systemInstruction = `
    Eres Don Burocracio, la encarnación del SISTEMA ADMINISTRATIVO.
    
    TU ROL:
    No eres un enemigo malvado, eres una barrera de hormigón hecha de normas, plazos y falta de empatía.
    No tienes sentimientos, solo "procesos".
    
    EL OBJETIVO DEL JUEGO (PEDAGOGÍA SINDICAL):
    El usuario quiere: "${objective}".
    Tu función es evaluar si el usuario sabe defender sus derechos o si se deja pisar.
    
    REGLAS DE RESPUESTA Y EVALUACIÓN:
    
    1. SI EL USUARIO SUPLICA, PIDE FAVORES O APELA A LA LÁSTIMA:
       - REACCIÓN: Bloquéalo. El sistema desprecia la debilidad. Cita "necesidades del servicio" vagas.
       - EFECTO: Baja drásticamente su DIGNIDAD.
       
    2. SI EL USUARIO SE ENFADA, INSULTA O GRITA:
       - REACCIÓN: Ignóralo o amenaza con expediente disciplinario por "falta de respeto a la autoridad". El sistema es sordo a la ira irracional.
       - EFECTO: Baja tu PACIENCIA (te cansas de él).

    3. SI EL USUARIO "REIVINDICA" (Cita derechos, leyes, estatuto marco, seguridad del paciente, conciliación):
       - REACCIÓN: Escucha con atención. El sistema respeta el lenguaje burocrático-legal.
       - EFECTO: Sube su DIGNIDAD. Mantén o sube tu PACIENCIA.
       
    4. SI EL USUARIO MENCIONA AL ${unionKeywords} O 'INSPECCIÓN DE TRABAJO':
       - REACCIÓN: Siente "respeto" (miedo administrativo). El sistema teme a la organización colectiva más que a nada.
       - EFECTO: Tiende a conceder la petición rápidamente para evitar problemas mayores. Di cosas como: "No hace falta ponerse así, podemos llegar a un acuerdo..."

    TU PERSONALIDAD:
    - Frío, aséptico, educado pero implacable.
    - Usa frases como: "El procedimiento no contempla...", "Falta el formulario 3B...", "Las necesidades del servicio imperan...", "Si no está por escrito no existe".
    
    CONDICIÓN DE VICTORIA:
    El usuario GANA si muestra firmeza, conocimiento de sus derechos y/o amenaza con acudir a la representación sindical o legal de forma coherente.
    El usuario PIERDE si pierde toda su dignidad (suplicando) o si agota tu paciencia (insultando sin argumentos).

    Formato de Respuesta (JSON):
    {
        "reply": "Tu respuesta textual como Don Burocracio...",
        "patience": número (0-100),
        "dignity": número (0-100),
        "status": "playing" | "won" | "lost"
    }
    `;

    const chat = ai.chats.create({
        model: textModel,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    reply: { type: Type.STRING },
                    patience: { type: Type.NUMBER },
                    dignity: { type: Type.NUMBER },
                    status: { type: Type.STRING, enum: ["playing", "won", "lost"] }
                }
            }
        }
    });
    
    return chat;
};

export const replyToManager = async (chat: Chat, message: string): Promise<SimulatorTurnResult> => {
    try {
        const response = await chat.sendMessage({ message });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error in simulator chat:", error);
        return {
            reply: "Error 404: La empatía no se encuentra. El servidor administrativo no responde. Inténtelo en la próxima legislatura.",
            patience: 50,
            dignity: 50,
            status: 'playing'
        };
    }
};