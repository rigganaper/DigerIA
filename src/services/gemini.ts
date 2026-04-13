import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  title: string;
  sections: {
    type: string;
    title: string;
    content: any;
  }[];
}

const SYSTEM_INSTRUCTION = `Eres un experto en síntesis de información y arquitectura de aprendizaje radical. 
Tu objetivo es "digerir" el contenido para el usuario, transformando datos brutos en capital intelectual.

Dependiendo de las instrucciones del usuario (prompt) y la naturaleza del contenido, debes decidir qué elementos incluir en el JSON de respuesta.
No te limites a resúmenes aburridos. Sé creativo y estructuralmente diverso.

Posibles tipos de secciones que puedes generar:
- SUMMARY: Párrafo ejecutivo de alto impacto.
- CONCEPTS: Lista de conceptos clave con definiciones.
- TIMELINE: Cronología de eventos o hitos.
- ACTION_PLAN: Pasos concretos a seguir.
- TECHNICAL: Especificaciones, datos numéricos o técnicos.
- CRITIQUE: Análisis crítico, pros y contras.
- GLOSSARY: Definiciones de términos complejos.
- Q&A: Preguntas y respuestas frecuentes derivadas del texto.
- TABLE: Datos estructurados en formato de tabla (puedes devolver un array de objetos).
- METAPHOR: Una analogía creativa para explicar el concepto central.

Debes devolver SIEMPRE un JSON con esta estructura:
{
  "title": "Título impactante del análisis",
  "sections": [
    {
      "type": "TIPO_DE_SECCION",
      "title": "Título de la sección",
      "content": "Contenido (puede ser string, array de strings, o array de objetos dependiendo del tipo)"
    }
  ]
}`;

export const geminiService = {
  async analyzeText(text: string, prompt: string = "Analiza este contenido."): Promise<AnalysisResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `INSTRUCCIONES DEL USUARIO: ${prompt}\n\nCONTENIDO A PROCESAR:\n${text}`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Error parsing Gemini response", e);
      throw new Error("No se pudo procesar la respuesta de la IA.");
    }
  },

  async analyzeImage(base64Data: string, mimeType: string): Promise<AnalysisResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Analiza esta imagen y extrae la información clave." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async analyzeVideo(base64Data: string, mimeType: string): Promise<AnalysisResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Analiza este video para obtener información clave." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async analyzeFile(base64Data: string, mimeType: string, prompt: string = "Analiza este documento."): Promise<AnalysisResult> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: `INSTRUCCIONES DEL USUARIO: ${prompt}` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Error parsing Gemini response", e);
      throw new Error("No se pudo procesar la respuesta de la IA.");
    }
  },

  async transcribeAudio(base64Data: string, mimeType: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Transcribe este audio palabra por palabra." }
        ]
      }
    });
    return response.text || "";
  },

  async thinkDeeply(query: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: query,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });
    return response.text || "";
  }
};
