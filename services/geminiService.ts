
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT, GEMINI_MODEL } from '../constants';
import { SceneDescriptionResponse } from '../types';

if (!process.env.API_KEY) {
    // This is a placeholder check. In a real environment, the key would be set.
    // For this context, we will proceed, but a real app should handle this gracefully.
    console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

export const analyzeImageForSceneDescription = async (imageFile: File): Promise<SceneDescriptionResponse> => {
    const base64Image = await fileToBase64(imageFile);
    const imagePart = {
        inlineData: {
            mimeType: imageFile.type,
            data: base64Image,
        },
    };

    const textPart = {
        text: SYSTEM_PROMPT,
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: { parts: [textPart, imagePart] },
        });

        const jsonString = response.text;
        
        // Basic cleanup in case the model wraps the JSON in markdown
        const cleanedJsonString = jsonString.replace(/^```json\n|```$/g, '').trim();

        const parsedResult: SceneDescriptionResponse = JSON.parse(cleanedJsonString);
        
        if (parsedResult.mode !== 'scene_description') {
            throw new Error("Received an unexpected response format from the AI.");
        }

        return parsedResult;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to analyze the image. The AI service may be unavailable or the response was invalid.");
    }
};
