// ─── Multi-Provider AI Service ────────────────────────────────────────────────
// Supports Groq (free, recommended), OpenRouter, and Mistral.
// Set AI_PROVIDER in .env to switch: "groq" | "openrouter" | "mistral"
//
// Provider setup:
//   Groq       → https://console.groq.com        → GROQ_API_KEY
//   OpenRouter → https://openrouter.ai            → OPENROUTER_API_KEY
//   Mistral    → https://console.mistral.ai       → MISTRAL_API_KEY

type Provider = "groq" | "openrouter" | "mistral";

const PROVIDER = (process.env.AI_PROVIDER || "groq") as Provider;

const KEYS: Record<Provider, string> = {
  groq:        process.env.GROQ_API_KEY        || "",
  openrouter:  process.env.OPENROUTER_API_KEY  || "",
  mistral:     process.env.MISTRAL_API_KEY     || "",
};

const ENDPOINTS: Record<Provider, string> = {
  groq:       "https://api.groq.com/openai/v1/chat/completions",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  mistral:    "https://api.mistral.ai/v1/chat/completions",
};

// Models per provider — all free-tier capable
const PRO_MODELS: Record<Provider, string> = {
  groq:       "llama-3.3-70b-versatile",
  openrouter: "google/gemini-3.1-pro-preview",
  mistral:    "mistral-small-latest",
};

const FLASH_MODELS: Record<Provider, string> = {
  groq:       "llama-3.1-8b-instant",
  openrouter: "google/gemini-3.1-flash-lite-preview",
  mistral:    "mistral-small-latest",
};

const API_KEY  = KEYS[PROVIDER];
const ENDPOINT = ENDPOINTS[PROVIDER];
const PRO_MODEL   = PRO_MODELS[PROVIDER];
const FLASH_MODEL = FLASH_MODELS[PROVIDER];

if (!API_KEY) {
  console.error(`❌ API Key para "${PROVIDER}" no encontrada. Revisa tu .env (${PROVIDER.toUpperCase()}_API_KEY)`);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AnalysisResult {
  title: string;
  sections: {
    type: string;
    title: string;
    content: any;
  }[];
}

// ─── System prompt ────────────────────────────────────────────────────────────

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

Debes devolver SIEMPRE un JSON válido con esta estructura exacta (sin markdown, sin bloques de código, solo JSON puro):
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

// ─── Core fetch helper ────────────────────────────────────────────────────────

async function callAI(
  model: string,
  messages: { role: "system" | "user"; content: any }[],
  jsonMode: boolean = false
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      `La API Key de ${PROVIDER} no está configurada. ` +
      `Añade ${PROVIDER.toUpperCase()}_API_KEY en tu .env`
    );
  }

  const body: any = { model, messages, max_tokens: 4096 };

  // json_object mode: Groq and OpenRouter support it; Mistral uses a different key
  if (jsonMode) {
    if (PROVIDER === "mistral") {
      body.response_format = { type: "json_object" };
    } else {
      body.response_format = { type: "json_object" };
    }
  }

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  // OpenRouter requires these extra headers
  if (PROVIDER === "openrouter") {
    headers["HTTP-Referer"] = window.location.origin;
    headers["X-Title"] = "DigerIA";
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    handleAPIError(response.status, errText);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── Error handler ────────────────────────────────────────────────────────────

function handleAPIError(status: number, message: string): never {
  console.error(`AI API Error [${PROVIDER}][${status}]:`, message);
  if (status === 401) throw new Error(`La API Key de ${PROVIDER} es inválida. Verifica tu configuración.`);
  if (status === 402) throw new Error(`Sin créditos en ${PROVIDER}. Revisa tu cuenta o cambia de proveedor.`);
  if (status === 429) throw new Error(`Límite de velocidad alcanzado en ${PROVIDER}. Espera unos segundos.`);
  if (status === 413) throw new Error("El contenido es demasiado grande. Intenta con un texto más corto.");
  if (status === 404) throw new Error("Modelo no disponible. Contacta al administrador.");
  throw new Error(`Error de IA [${status}]: ${message}`);
}

function rethrowIfKnown(e: any): void {
  const known = ["La API Key", "Se agotó", "El archivo", "Error de IA", "Modelo de IA", "Sin créditos", "Límite", "El contenido"];
  if (known.some(prefix => e.message?.startsWith(prefix))) throw e;
}

// ─── Exported service (same public interface as before) ───────────────────────

// Helper to clean JSON from potential markdown code blocks
const cleanJSONResponse = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const geminiService = {

  async analyzeText(text: string, prompt: string = "Analiza este contenido."): Promise<AnalysisResult> {
    try {
      const result = await callAI(
        PRO_MODEL,
        [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content: `INSTRUCCIONES DEL USUARIO: ${prompt}\n\nCONTENIDO A PROCESAR:\n${text}` },
        ],
        true
      );
      return JSON.parse(cleanJSONResponse(result || "{}"));
    } catch (e: any) {
      rethrowIfKnown(e);
      throw e;
    }
  },

  async analyzeImage(base64Data: string, mimeType: string, prompt: string = "Analiza esta imagen y extrae la información clave."): Promise<AnalysisResult> {
    try {
      // Groq's vision model (Llama 4 Scout)
      const visionModel = PROVIDER === "groq" ? "meta-llama/llama-4-scout-17b-16e-instruct" : "google/gemini-3.1-flash-image-preview";
      const result = await callAI(
        visionModel,
        [
          { role: "system", content: SYSTEM_INSTRUCTION },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } },
              { type: "text", text: `INSTRUCCIONES DEL USUARIO: ${prompt}` },
            ],
          },
        ],
        true
      );
      return JSON.parse(cleanJSONResponse(result || "{}"));
    } catch (e: any) {
      rethrowIfKnown(e);
      throw e;
    }
  },

  async analyzeVideo(_base64Data: string, _mimeType: string, _prompt: string = "Analiza este video."): Promise<AnalysisResult> {
    throw new Error("El análisis de video inline no está soportado por el proveedor actual. Extrae el audio o usa texto.");
  },

  async analyzeFile(base64Data: string, mimeType: string, prompt: string = "Analiza este documento."): Promise<AnalysisResult> {
    try {
      const visionModel = PROVIDER === "groq" ? "meta-llama/llama-4-scout-17b-16e-instruct" : PRO_MODEL;
      const result = await callAI(
        visionModel,
        [
          { role: "system", content: SYSTEM_INSTRUCTION },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } },
              { type: "text", text: `INSTRUCCIONES DEL USUARIO: ${prompt}` },
            ],
          },
        ],
        true
      );
      return JSON.parse(cleanJSONResponse(result || "{}"));
    } catch (e: any) {
      rethrowIfKnown(e);
      throw e;
    }
  },

  async transcribeAudio(_base64Data: string, _mimeType: string): Promise<string> {
    throw new Error("La transcripción de audio no está disponible en el proveedor actual. Usa Whisper de OpenAI o Groq directamente.");
  },

  async thinkDeeply(query: string): Promise<string> {
    try {
      const result = await callAI(
        PRO_MODEL,
        [
          { role: "system", content: "Eres un experto analítico. Piensa profundamente y responde de forma estructurada y detallada." },
          { role: "user", content: query },
        ],
        false
      );
      return result;
    } catch (e: any) {
      rethrowIfKnown(e);
      throw e;
    }
  },
};
