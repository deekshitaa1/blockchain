import { GoogleGenAI, Type } from "@google/genai";
import { Language } from "../types";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// Cache for translations to avoid redundant API calls
const translationCache: { [key: string]: string } = {};

export const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
    if (targetLanguage === Language.English) {
        return text;
    }
    const cacheKey = `${text}:${targetLanguage}`;
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    const model = 'gemini-2.5-flash';
    const prompt = `Translate the following English text to the language with ISO 639-1 code '${targetLanguage}': "${text}". Return only the translated text, without any introductory phrases or quotes.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        const translated = response.text.trim();
        translationCache[cacheKey] = translated;
        return translated;
    } catch (error) {
        console.error('Error translating text:', error);
        return text; // Fallback to original text on error
    }
};


export const generateText = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('Error generating text:', error);
        return 'An error occurred while generating a response.';
    }
};

export async function* generateTextStream(prompt: string, systemInstruction: string): AsyncGenerator<string> {
    try {
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
            },
        });

        for await (const chunk of responseStream) {
            yield chunk.text;
        }
    } catch (error) {
        console.error('Error generating text stream:', error);
        yield "An error occurred while streaming the response.";
    }
}

export const generateStructuredText = async (prompt: string, schema: any): Promise<any> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error generating structured text:', error);
        return { error: 'An error occurred while generating a structured response.' };
    }
};
