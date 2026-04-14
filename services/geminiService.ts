
import { GoogleGenAI, Type } from "@google/genai";
import { PaletteResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeImageColors = async (base64Image: string): Promise<PaletteResult> => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1] || base64Image,
          },
        },
        {
          text: "Act as a world-class color theorist and designer. Analyze this image. 1. Create a poetic, short title (2-3 words) for the image's mood (e.g., 'Verdant Echo', 'Sun-Drenched Silence'). 2. Extract 5-6 dominant colors. For each: provide a sophisticated name, Hex, RGB, and CMYK. Return as JSON.",
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          moodTitle: { type: Type.STRING },
          colors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                hex: { type: Type.STRING },
                rgb: { type: Type.STRING },
                cmyk: { type: Type.STRING },
              },
              required: ["name", "hex", "rgb", "cmyk"],
            },
          },
        },
        required: ["moodTitle", "colors"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from AI");
  
  return JSON.parse(text) as PaletteResult;
};
