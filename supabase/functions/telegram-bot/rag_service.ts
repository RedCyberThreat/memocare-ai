import OpenAI from "npm:openai";
import { createClient } from "npm:@supabase/supabase-js@2";
import { SHERPA_SYSTEM_PROMPT } from "./prompt.ts";

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
const supabase = createClient(
  Deno.env.get("REMOTE_SUPABASE_URL")!,
  Deno.env.get("REMOTE_SUPABASE_SERVICE_ROLE_KEY")!,
);

interface MatchedDocument {
  content: string;
}

export async function askSherpa(messages: any[]) {
  const lastUserMessage = messages[messages.length - 1].content;

  // 1. EMBEDDING
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: lastUserMessage,
  });

  // 2. HYBRID RETRIEVAL
  const { data: documents, error: rpcError } = await supabase.rpc(
    "match_documents_hybrid",
    {
      query_embedding: queryEmbedding.data[0].embedding,
      query_text: lastUserMessage,
      match_threshold: 0.1,
      match_count: 15,
    },
  );

  if (rpcError) throw rpcError;
  const initialDocs = (documents as MatchedDocument[]) || [];

  // 3. COHERE RE-RANKING
  let topDocs = initialDocs.slice(0, 3);

  if (initialDocs.length > 0) {
    try {
      const cohereResponse = await fetch("https://api.cohere.ai/v1/rerank", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("COHERE_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "rerank-multilingual-v3.0",
          query: lastUserMessage,
          documents: initialDocs.map((doc) => doc.content),
          top_n: 3,
        }),
      });

      if (cohereResponse.ok) {
        const cohereData = await cohereResponse.json();
        topDocs = cohereData.results.map((r: any) => initialDocs[r.index]);
      }
    } catch (err) {
      console.warn("[RAG] Cohere failed, using fallback slice.", err);
    }
  }

  const contextText = topDocs.map((d) => d.content).join("\n\n");

  // --- PHASE 3: PRE-ANALYSIS FOR STRESS-RESPONSIVE PROMPT ---
  // We do a quick check of the history/message to see if we should inject the crisis protocol
  // Or, we let the LLM handle it in one go, but we reinforce the system prompt here.

  // 4. GENERATION
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SHERPA_SYSTEM_PROMPT(contextText) },
      ...messages,
    ],
  });

  const fullText = response.choices[0].message.content || "";

  // 5. THE PARSER (Greedy & Safe)
  const analysisRegex = /\[\[ANALYSIS:\s*({.*?})\s*\]+\]?/s;
  const match = fullText.match(analysisRegex);

  let analysis = { stress_score: 5, sentiment: "neutral" };
  let cleanAnswer = fullText;

  if (match) {
    try {
      let jsonString = match[1].trim();

      // FIX: Handle accidental double braces like }}
      const lastBraceIndex = jsonString.lastIndexOf("}");
      if (lastBraceIndex !== -1) {
        jsonString = jsonString.substring(0, lastBraceIndex + 1);
      }

      analysis = JSON.parse(jsonString);

      // Remove the analysis block from the user-facing text
      cleanAnswer = fullText.replace(analysisRegex, "").trim();
      console.log(`✅ Parser Success: Stress ${analysis.stress_score}`);
    } catch (e) {
      console.error("❌ Parser JSON Error:", e.message);
      // Clean the brackets anyway so the user doesn't see garbage
      cleanAnswer = fullText.replace(/\[\[ANALYSIS:.*?\]\]/gs, "").trim();
    }
  }

  // --- CRITICAL FIX: ALWAYS RETURN THE OBJECT ---
  return { answer: cleanAnswer, analysis };
}

// --- Dev 2: TTS & Database Logic ---
export async function generateVoice(text: string): Promise<Uint8Array> {
  // Clean text from Markdown (asterisks, etc.) before TTS for better audio
  const cleanForTTS = text.replace(/\*\*|\*/g, "");

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "tts-1",
      input: cleanForTTS.substring(0, 4000),
      voice: "shimmer",
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI TTS error: ${response.statusText}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

export async function saveAnalytics(
  userId: string,
  stress: number,
  sentiment: string,
) {
  const { error } = await supabase
    .from("user_analytics")
    .insert({ user_id: userId, stress_score: stress, sentiment });

  if (error) {
    console.error("❌ Analytics Insert Error:", error.message);
  }
}
  