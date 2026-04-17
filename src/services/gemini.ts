import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY no está configurada. Revisa tu archivo .env");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Use stable models
const PRO_MODEL = "gemini-2.5-pro";
const FLASH_MODEL = "gemini-2.5-flash";

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

function handleGeminiError(error: any): never {
  const message = error?.message || String(error);
  console.error("Gemini API Error:", message);

  if (!API_KEY) {
    throw new Error("La API Key de Gemini no está configurada. Contacta al administrador.");
  }
  if (message.includes("API_KEY_INVALID") || message.includes("401")) {
    throw new Error("La API Key de Gemini es inválida. Verifica tu configuración.");
  }
  if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429") || message.includes("quota")) {
    throw new Error("Se agotó la cuota de la API de Gemini. Intenta de nuevo más tarde.");
  }
  if (message.includes("Request payload size") || message.includes("too large") || message.includes("413")) {
    throw new Error("El archivo es demasiado grande para ser procesado. Intenta con un archivo más pequeño (máx. 5MB).");
  }
  if (message.includes("not found") || message.includes("404")) {
    throw new Error("Modelo de IA no disponible. Contacta al administrador.");
  }
  throw new Error(`Error de IA: ${message}`);
}

export const geminiService = {
  async analyzeText(text: string, prompt: string = "Analiza este contenido."): Promise<AnalysisResult> {
    try {
      const response = await ai.models.generateContent({
        model: PRO_MODEL,
        contents: `INSTRUCCIONES DEL USUARIO: ${prompt}\n\nCONTENIDO A PROCESAR:\n${text}`,
        config: {
          responseMimeType: "application/json",
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (e: any) {
      if (e.message?.startsWith("Error de IA:") || e.message?.startsWith("La API") || e.message?.startsWith("Se agotó") || e.message?.startsWith("El archivo")) throw e;
      handleGeminiError(e);
    }
  },

  async analyzeImage(base64Data: string, mimeType: string, prompt: string = "Analiza esta imagen y extrae la información clave."): Promise<AnalysisResult> {
    try {
      const response = await ai.models.generateContent({
        model: FLASH_MODEL,
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
      return JSON.parse(response.text || "{}");
    } catch (e: any) {
      if (e.message?.startsWith("Error de IA:") || e.message?.startsWith("La API") || e.message?.startsWith("Se agotó") || e.message?.startsWith("El archivo")) throw e;
      handleGeminiError(e);
    }
  },

  async analyzeVideo(base64Data: string, mimeType: string, prompt: string = "Analiza este video para obtener información clave."): Promise<AnalysisResult> {
    try {
      const response = await ai.models.generateContent({
        model: FLASH_MODEL,
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
      return JSON.parse(response.text || "{}");
    } catch (e: any) {
      if (e.message?.startsWith("Error de IA:") || e.message?.startsWith("La API") || e.message?.startsWith("Se agotó") || e.message?.startsWith("El archivo")) throw e;
      handleGeminiError(e);
    }
  },

  async analyzeFile(base64Data: string, mimeType: string, prompt: string = "Analiza este documento."): Promise<AnalysisResult> {
    try {
      const response = await ai.models.generateContent({
        model: PRO_MODEL,
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

      return JSON.parse(response.text || "{}");
    } catch (e: any) {
      if (e.message?.startsWith("Error de IA:") || e.message?.startsWith("La API") || e.message?.startsWith("Se agotó") || e.message?.startsWith("El archivo")) throw e;
      handleGeminiError(e);
    }
  },

  async transcribeAudio(base64Data: string, mimeType: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: FLASH_MODEL,
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Transcribe este audio palabra por palabra." }
          ]
        }
      });
      return response.text || "";
    } catch (e: any) {
      handleGeminiError(e);
    }
  },

  async thinkDeeply(query: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: PRO_MODEL,
        contents: query,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });
      return response.text || "";
    } catch (e: any) {
      handleGeminiError(e);
    }
  }
};
