import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  Bot,
  webhookCallback,
  session,
  InputFile,
  Context,
  SessionFlavor,
  InlineKeyboard,
} from "npm:grammy";
import { OpenAI } from "npm:openai";
import { askSherpa, generateVoice, saveAnalytics } from "./rag_service.ts";

// --- Types & Config ---
interface SessionData {
  history: { role: "user" | "assistant"; content: string }[];
  preference?: "text" | "voice";
}
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(Deno.env.get("TELEGRAM_BOT_TOKEN")!);
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

// 1. UPDATED CORS HEADERS (Added Methods)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

bot.use(session({ initial: () => ({ history: [] }) }));

async function getSherpaLogic(text: string, history: any[], userId: string) {
  const currentHistory = [...history, { role: "user", content: text }].slice(-6);
  const result = await askSherpa(currentHistory);
  const { answer, analysis } = result;
  saveAnalytics(userId, analysis.stress_score, analysis.sentiment).catch(console.error);
  return { answer, analysis, updatedHistory: [...currentHistory, { role: "assistant", content: answer }] };
}

async function handleTelegramFlow(ctx: MyContext, text: string) {
  const userId = ctx.from?.id.toString() || "unknown";
  try {
    const { answer, updatedHistory } = await getSherpaLogic(text, ctx.session.history, userId);
    ctx.session.history = updatedHistory;
    if (ctx.session.preference === "voice") {
      const audioBuffer = await generateVoice(answer);
      await ctx.replyWithVoice(new InputFile(audioBuffer, "sherpa_voice.mp3"));
    } else {
      await ctx.reply(answer);
    }
  } catch (err) {
    console.error("Telegram Flow Error:", err);
    await ctx.reply("Lo siento, he tenido un pequeño error.");
  }
}

bot.on("message:text", (ctx) => handleTelegramFlow(ctx, ctx.message.text));

const handleUpdate = webhookCallback(bot, "std/http");

serve(async (req) => {
  // 2. PREFLIGHT HANDLER (Crucial for CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // We clone the request so we can read the body twice if needed
    const clonedReq = req.clone();
    const body = await req.json();

    // 3. WEB CHAT LOGIC
    if (body.isWebChat) {
      const { answer, analysis } = await getSherpaLogic(
        body.message.text, 
        body.history || [], 
        "web-user"
      );

      return new Response(
        JSON.stringify({ reply: answer, analysis }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. TELEGRAM LOGIC
    return await handleUpdate(clonedReq);

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 200, // Return 200 so CORS doesn't fail on errors
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
