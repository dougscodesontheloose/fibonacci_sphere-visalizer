import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an explanation or insight about the Fibonacci Sphere or Golden Ratio.
 */
export const generateMathInsight = async (
  points: number,
  topic: string
): Promise<string> => {
  try {
    const prompt = `
      You are an expert mathematician and creative coder.
      The user is visualizing a Fibonacci Sphere with ${points} points.
      
      Topic requested: ${topic}.
      
      Explain this concept briefly (max 2 paragraphs). 
      Focus on the beauty of the math, specifically the Golden Ratio (Phi).
      If relevant, mention how the points are distributed using the formula involving the Golden Angle.
      Format with Markdown.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, knowledgeable, and concise math tutor.",
        temperature: 0.7,
      }
    });

    return response.text || "No insight generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to fetch AI insights at this moment. Please check your API key connection.";
  }
};

/**
 * Stream a chat response about 3D geometry or math.
 */
export const streamChatResponse = async function* (
  history: { role: string; text: string }[],
  newMessage: string
) {
  try {
    const contents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));
    
    // Add new message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are an enthusiastic 3D geometry expert. Keep answers short and strictly related to math, geometry, or the golden ratio."
      }
    });

    for await (const chunk of responseStream) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Stream Error:", error);
    yield "Error connecting to AI service.";
  }
};
