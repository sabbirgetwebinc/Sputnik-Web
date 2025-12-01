import { GoogleGenAI } from "@google/genai";
import { ArtifactType } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY || '';
  if (!apiKey) {
    console.warn("API Key is missing. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeArtifactWithGemini = async (
  artifact: string,
  type: ArtifactType
): Promise<string> => {
  const client = getGeminiClient();
  if (!client) {
    return "API Key not configured. Unable to perform AI analysis.";
  }

  try {
    const prompt = `
      You are an expert Cybersecurity Analyst and OSINT investigator. 
      I have an artifact that I am investigating: "${artifact}".
      I have detected it as type: ${type}.

      Please provide a brief, high-level analysis strategy for this artifact. 
      1. What is this artifact likely to be based on its format?
      2. If it is a known malicious indicator (public knowledge only), briefly mention it.
      3. Recommend 3 specific things I should look for when opening threat intelligence reports for this artifact.
      4. Provide a safety warning if applicable.

      Keep the response concise, professional, and formatted in Markdown.
      Do not perform active scanning or interact with the artifact. 
      Focus on methodology and static analysis advice.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to analyze artifact with Gemini. Please try again later.";
  }
};