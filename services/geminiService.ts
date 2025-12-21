
import { GoogleGenerativeAI, SchemaType, ChatSession } from "@google/generative-ai";
import { SurrealConsultationResult, CampaignPost, PosterContent, DiplomaContent, AcronymGeneratorResult, SimulatorTurnResult } from '../lib/types';
import { CampaignPhase, getSystemInstructionForPhase } from '../lib/campaignGems';

// Get API key from Vite environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (window as any).__GEMINI_API_KEY__;

if (!apiKey) {
    console.error('❌ No API key found. Please set VITE_GEMINI_API_KEY in your Vercel/Environment variables.');
}

// Inicializar el SDK oficial
const genAI = new GoogleGenerativeAI(apiKey || "");

// Configurar ajustes de seguridad permisivos para el tono irónico/sarcástico
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

// Helper function to generate images using free Pollinations.ai API
async function generateImageWithPollinations(prompt: string): Promise<string> {
    try {
        const encodedPrompt = encodeURIComponent(prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                const base64Data = base64.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error("Error in generateImageWithPollinations:", error);
        throw error;
    }
}

// Modelos estables
const textModelName = 'gemini-1.5-flash';

export const handleSurrealConsultation = async (queryOrAudio: string, campaignPhase: CampaignPhase, isAudio: boolean = false): Promise<SurrealConsultationResult> => {
    try {
        const baseInstruction = `Tu objetivo es ser un Oráculo sindical surrealista para la campaña P.A.S.O. Responde a las consultas con humor, ironía y metáforas abstractas. NO des consejos prácticos. Tu objetivo es ser críptico, inteligente y extrañamente motivador. Al final de tu respuesta, crea un prompt para una imagen que represente tu consejo conceptualmente.`;
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n\n${baseInstruction}`;

        const responseSchema = {
            type: SchemaType.OBJECT,
            properties: {
                consultationText: {
                    type: SchemaType.STRING,
                    description: "La respuesta surrealista e irónica del oráculo."
                },
                imagePrompt: {
                    type: SchemaType.STRING,
                    description: "Un prompt detallado para un generador de imágenes, de estilo conceptual y surrealista, que capture la esencia de la respuesta."
                }
            },
            required: ["consultationText", "imagePrompt"]
        };

        const model = genAI.getGenerativeModel({
            model: textModelName,
            systemInstruction: systemInstruction,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
            safetySettings: safetySettings,
        });

        let contents: any;
        if (isAudio) {
            contents = [
                {
                    inlineData: {
                        mimeType: 'audio/wav',
                        data: queryOrAudio
                    }
                },
                {
                    text: "Escucha esta consulta de un sanitario agotado. Analiza su tono de voz y responde en consecuencia."
                }
            ];
        } else {
            // For simple text queries, pass the string directly or a simple Part object
            contents = `Aquí está la consulta del sanitario: "${queryOrAudio}"`;
        }

        const result = await model.generateContent(contents);
        const textResponse = result.response.text();
        const payload = JSON.parse(textResponse);

        let imageB64 = '';
        try {
            imageB64 = await generateImageWithPollinations(payload.imagePrompt);
        } catch (pollinationsError) {
            console.error("Pollinations.ai failed, using placeholder:", pollinationsError);
            imageB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        }

        return {
            text: payload.consultationText,
            imageB64: imageB64,
        };

    } catch (error: any) {
        console.error("Error in handleSurrealConsultation:", error);
        throw new Error(`Failed to get surreal consultation from AI: ${error.message || error}`);
    }
};

export const generateSocialPost = async (options: { platform: string; tone: string; campaignPhase: CampaignPhase; theme: string }): Promise<Omit<CampaignPost, 'id' | 'createdAt'>> => {
    try {
        const { platform, tone, campaignPhase, theme } = options;

        let systemInstruction = getSystemInstructionForPhase(campaignPhase);
        let imagePromptAdditions = `Estilo: surrealismo digital, paleta de colores oscuros.`;

        if (campaignPhase !== 'Llegada') {
            systemInstruction += ` La campaña está respaldada por UGT, por lo que puedes incluir sutilmente su logo o colores corporativos (rojo #E30613, verde #16a34a).`;
            imagePromptAdditions = `Estilo: surrealismo digital, acentos rojos (#E30613) y verdes (#16a34a).`;
        }

        const prompt = `Genera una publicación para ${platform} con tono ${tone}, fase ${campaignPhase} y tema ${theme}.`;

        const responseSchema = {
            type: SchemaType.OBJECT,
            properties: {
                acronym: { type: SchemaType.STRING },
                postText: { type: SchemaType.STRING },
                imagePrompt: { type: SchemaType.STRING }
            },
            required: ["acronym", "postText", "imagePrompt"]
        };

        const model = genAI.getGenerativeModel({
            model: textModelName,
            systemInstruction,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema
            }
        });

        const result = await model.generateContent(prompt);
        const payload = JSON.parse(result.response.text());

        const imageB64 = await generateImageWithPollinations(`${imagePromptAdditions} ${payload.imagePrompt}`);

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
        const systemInstruction = getSystemInstructionForPhase(campaignPhase);
        const prompt = "Crea un set de textos para un cartel de campaña. Proporciona un titular, un eslogan principal con P.A.S.O. y un subtítulo.";

        const responseSchema = {
            type: SchemaType.OBJECT,
            properties: {
                headline: { type: SchemaType.STRING },
                slogan: { type: SchemaType.STRING },
                subtitle: { type: SchemaType.STRING },
            },
            required: ["headline", "slogan", "subtitle"]
        };

        const model = genAI.getGenerativeModel({
            model: textModelName,
            systemInstruction,
            generationConfig: { responseMimeType: "application/json", responseSchema }
        });

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Error in generatePosterContent:", error);
        throw new Error("Failed to generate poster content.");
    }
};

export const generateBingoPhrases = async (theme: string, campaignPhase: CampaignPhase): Promise<string[]> => {
    try {
        const systemInstruction = getSystemInstructionForPhase(campaignPhase) + " Genera frases muy cortas para un bingo.";
        const prompt = `Genera 16 frases cortas para un bingo sobre "${theme}".`;

        const responseSchema = {
            type: SchemaType.OBJECT,
            properties: {
                phrases: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                }
            },
            required: ["phrases"]
        };

        const model = genAI.getGenerativeModel({
            model: textModelName,
            systemInstruction,
            generationConfig: { responseMimeType: "application/json", responseSchema }
        });

        const result = await model.generateContent(prompt);
        const payload = JSON.parse(result.response.text());
        return payload.phrases;
    } catch (error) {
        console.error("Error in generateBingoPhrases:", error);
        throw new Error("Failed to generate bingo phrases.");
    }
};

export const generateDiplomaContent = async (theme: string, campaignPhase: CampaignPhase): Promise<DiplomaContent> => {
    try {
        const systemInstruction = getSystemInstructionForPhase(campaignPhase);
        const prompt = `Genera un diploma irónico sobre "${theme}".`;

        const responseSchema = {
            type: SchemaType.OBJECT,
            properties: {
                title: { type: SchemaType.STRING },
                body: { type: SchemaType.STRING },
            },
            required: ["title", "body"]
        };

        const model = genAI.getGenerativeModel({
            model: textModelName,
            systemInstruction,
            generationConfig: { responseMimeType: "application/json", responseSchema }
        });

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Error in generateDiplomaContent:", error);
        throw new Error("Failed to generate diploma content.");
    }
};

export const generateCreativeAcronyms = async (
    inputData: string,
    inputType: 'text' | 'image',
    campaignPhase: CampaignPhase
): Promise<AcronymGeneratorResult> => {
    try {
        const systemInstruction = getSystemInstructionForPhase(campaignPhase);

        const responseSchema = {
            type: SchemaType.OBJECT,
            properties: {
                acronyms: {
                    type: SchemaType.ARRAY,
                    items: { type: SchemaType.STRING }
                },
                explanation: { type: SchemaType.STRING }
            },
            required: ["acronyms", "explanation"]
        };

        const model = genAI.getGenerativeModel({
            model: textModelName,
            systemInstruction,
            generationConfig: { responseMimeType: "application/json", responseSchema }
        });

        let contents: any;
        if (inputType === 'image') {
            contents = [
                { inlineData: { mimeType: 'image/jpeg', data: inputData } },
                { text: "Genera 5 significados para P.A.S.O. basados en esta imagen." }
            ];
        } else {
            contents = `Genera 5 significados para P.A.S.O. basados en: ${inputData}`;
        }

        const result = await model.generateContent(contents);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Error in generateCreativeAcronyms:", error);
        throw new Error("Failed to generate acronyms.");
    }
};

export const initManagerChat = (objective: string = "Moscoso", campaignPhase: CampaignPhase = 'Llegada'): ChatSession => {
    const isRevelacion = campaignPhase === 'Revelacion';
    const unionKeywords = isRevelacion ? "UGT, SINDICATO" : "SINDICATO";

    const systemInstruction = `Eres Don Burocracio. El usuario quiere: ${objective}. Evalúa su DIGNIDAD y tu PACIENCIA. Si menciona ${unionKeywords}, cede un poco. Responde siempre en JSON.`;

    const model = genAI.getGenerativeModel({
        model: textModelName,
        systemInstruction,
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    reply: { type: SchemaType.STRING },
                    patience: { type: SchemaType.NUMBER },
                    dignity: { type: SchemaType.NUMBER },
                    status: { type: SchemaType.STRING }
                },
                required: ["reply", "patience", "dignity", "status"]
            }
        }
    });

    return model.startChat();
};

export const replyToManager = async (chat: ChatSession, message: string): Promise<SimulatorTurnResult> => {
    try {
        const result = await chat.sendMessage(message);
        return JSON.parse(result.response.text());
    } catch (error) {
        console.error("Error in simulator chat:", error);
        return {
            reply: "Error burocrático.",
            patience: 50,
            dignity: 50,
            status: 'playing'
        };
    }
};