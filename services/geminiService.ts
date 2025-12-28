
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import { SurrealConsultationResult, CampaignPost, PosterContent, DiplomaContent, AcronymGeneratorResult, SimulatorTurnResult } from '../lib/types';
import { CampaignPhase, getSystemInstructionForPhase } from '../lib/campaignGems';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModel = 'gemini-3-pro-preview';
const imageModel = 'imagen-4.0-generate-001';

// Ayudante para inyectar la prohibición de UGT según la fase
const getUgtDirective = (phase: CampaignPhase) => 
    phase === 'Revelacion' 
    ? "Puedes y debes mencionar que UGT es el sindicato real detrás de P.A.S.O." 
    : "ESTÁ ESTRICTAMENTE PROHIBIDO mencionar a 'UGT' o cualquier sindicato real. Mantén el secreto.";

export const handleSurrealConsultation = async (queryOrAudio: string, campaignPhase: CampaignPhase, isAudio: boolean = false): Promise<SurrealConsultationResult> => {
    try {
        const baseInstruction = `Tu objetivo es ser un Oráculo sindical surrealista. Responde con humor e ironía. ${getUgtDirective(campaignPhase)}`;
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n\n${baseInstruction}`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                consultationText: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
            }
        };

        let contents: any = isAudio ? {
            parts: [
                { inlineData: { mimeType: 'audio/wav', data: queryOrAudio } },
                { text: "Analiza el tono y responde. " + getUgtDirective(campaignPhase) }
            ]
        } : `Consulta: "${queryOrAudio}". Recuerda: ${getUgtDirective(campaignPhase)}`;

        const textResponse: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: contents,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema }
        });

        const payload = JSON.parse(textResponse.text);
        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: payload.imagePrompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' }
        });

        return { text: payload.consultationText, imageB64: imageResponse.generatedImages[0].image.imageBytes };
    } catch (error) {
        throw new Error("Failed to get surreal consultation.");
    }
};

export const generateSocialPost = async (options: { platform: string; tone: string; campaignPhase: CampaignPhase; theme: string }): Promise<Omit<CampaignPost, 'id' | 'createdAt'>> => {
    try {
        const { platform, tone, campaignPhase, theme } = options;
        const isRevelacion = campaignPhase === 'Revelacion';
        
        let systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n${getUgtDirective(campaignPhase)}`;
        let imagePromptAdditions = isRevelacion 
            ? "Paleta: oscuros con acentos de rojo #E30613 y verde #16a34a (colores UGT)." 
            : "Paleta: neutros, ciberpunk, evita colores sindicales tradicionales.";

        const prompt = `Genera post para ${platform}. Tono ${tone}. Tema: ${theme}. ${getUgtDirective(campaignPhase)}`;
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                acronym: { type: Type.STRING },
                postText: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
            }
        };

        const textResponse = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema }
        });

        const payload = JSON.parse(textResponse.text);
        const imageResponse = await ai.models.generateImages({
            model: imageModel,
            prompt: `${imagePromptAdditions} ${payload.imagePrompt}`,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' }
        });

        return {
            platform, tone, campaignPhase, theme,
            postText: `P.A.S.O.: ${payload.acronym}\n\n${payload.postText}`,
            imageB64: imageResponse.generatedImages[0].image.imageBytes,
            imagePrompt: payload.imagePrompt,
        };
    } catch (error) {
        throw new Error("Failed to generate campaign post.");
    }
};

export const generatePosterContent = async (campaignPhase: CampaignPhase): Promise<PosterContent> => {
    try {
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n${getUgtDirective(campaignPhase)}`;
        const prompt = `Crea textos para cartel. ${getUgtDirective(campaignPhase)}`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING },
                slogan: { type: Type.STRING },
                subtitle: { type: Type.STRING },
            },
        };

        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema }
        });

        return JSON.parse(response.text);
    } catch (error) {
        throw new Error("Failed to generate poster content.");
    }
};

export const generateBingoPhrases = async (theme: string, campaignPhase: CampaignPhase): Promise<string[]> => {
    try {
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n${getUgtDirective(campaignPhase)}`;
        const prompt = `16 frases cortas (5-7 palabras) para bingo sobre "${theme}". ${getUgtDirective(campaignPhase)}`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                phrases: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        };

        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema }
        });
        
        return JSON.parse(response.text).phrases;
    } catch (error) {
        throw new Error("Failed to generate bingo phrases.");
    }
};

export const generateDiplomaContent = async (theme: string, campaignPhase: CampaignPhase): Promise<DiplomaContent> => {
    try {
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n${getUgtDirective(campaignPhase)}`;
        const prompt = `Texto para diploma irónico sobre "${theme}". ${getUgtDirective(campaignPhase)}`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                body: { type: Type.STRING },
            },
        };

        const response = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema }
        });

        return JSON.parse(response.text);
    } catch (error) {
        throw new Error("Failed to generate diploma content.");
    }
};

export const generateCreativeAcronyms = async (inputData: string, inputType: 'text' | 'image', campaignPhase: CampaignPhase): Promise<AcronymGeneratorResult> => {
    try {
        const systemInstruction = `${getSystemInstructionForPhase(campaignPhase)}\n${getUgtDirective(campaignPhase)}`;
        let contents: any = inputType === 'image' 
            ? { parts: [{ inlineData: { mimeType: 'image/jpeg', data: inputData } }, { text: "Genera 5 acrónimos. " + getUgtDirective(campaignPhase) }] }
            : `Analiza: "${inputData}". Genera 5 acrónimos P.A.S.O. ${getUgtDirective(campaignPhase)}`;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                acronyms: { type: Type.ARRAY, items: { type: Type.STRING } },
                explanation: { type: Type.STRING }
            },
        };

        const response = await ai.models.generateContent({
            model: textModel,
            contents: contents,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema }
        });

        return JSON.parse(response.text);
    } catch (error) {
        throw new Error("Failed to generate acronyms.");
    }
};

export const initManagerChat = (objective: string = "Conseguir un día de libre disposición", campaignPhase: CampaignPhase = 'Llegada'): Chat => {
    const isRevelacion = campaignPhase === 'Revelacion';
    const unionKeywords = isRevelacion ? "'UGT', 'SINDICATO', 'DELEGADO'" : "'SINDICATO', 'DELEGADO'";

    const systemInstruction = `
    Eres Don Burocracio. ${getUgtDirective(campaignPhase)}
    Si el usuario menciona a ${unionKeywords}, reacciona con respeto/miedo.
    RECUERDA: ${isRevelacion ? "Identifica a UGT como la fuerza que te asusta." : "NO menciones a UGT, solo al concepto genérico de sindicato."}
    
    Formato JSON: { "reply": "...", "patience": 0-100, "dignity": 0-100, "status": "playing"|"won"|"lost" }
    `;

    return ai.chats.create({
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
};

export const replyToManager = async (chat: Chat, message: string): Promise<SimulatorTurnResult> => {
    try {
        const response = await chat.sendMessage({ message });
        return JSON.parse(response.text);
    } catch (error) {
        return { reply: "Error de sistema.", patience: 50, dignity: 50, status: 'playing' };
    }
};
