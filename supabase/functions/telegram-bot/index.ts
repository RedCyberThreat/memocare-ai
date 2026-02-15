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

const bot = new Bot<MyContext>(Deno.env.get("TELEGRAM_BOT_TOKEN") || "");
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") || "" });

// CORS HEADERS for web chat
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

bot.use(session({ initial: () => ({ history: [] }) }));

// --- COMMANDS & HANDLERS ---

bot.command("start", async (ctx: MyContext) => {
  ctx.session.history = [];

  const welcomeText = `
👋 **Hola. Soy tu Sherpa Digital.**
¿Cómo prefieres que nos comuniquemos hoy?

👋 **Sóc el teu Sherpa Digital.**
Com prefereixes que ens comuniquem avui?

👋 **Sono il tuo Sherpa Digitale.**
Come preferisci comunicare oggi?

👋 **Hello. I am your Digital Sherpa.**
How would you like to communicate today?
`;

  const keyboard = new InlineKeyboard()
    .text("✍️ Texto / Text / Testo", "pref_text")
    .row()
    .text("🎙️ Voz / Veu / Voce / Voice", "pref_voice");

  await ctx.reply(welcomeText, { parse_mode: "Markdown", reply_markup: keyboard });
});

bot.callbackQuery(/^pref_/, async (ctx: MyContext) => {
  const choice = ctx.callbackQuery.data === "pref_voice" ? "voice" : "text";
  ctx.session.preference = choice;

  const confirmation =
    choice === "voice"
      ? "🎙️ OK! (Voice Mode / Modo Voz / Modo Veu)"
      : "✍️ OK! (Text Mode / Modo Texto / Modo Text)";

  await ctx.answerCallbackQuery();
  await ctx.reply(confirmation);
});

/**
 * handleFlow: Respects user's preference for voice/text
 */
async function handleFlow(ctx: MyContext, text: string): Promise<void> {
  const userId = ctx.from?.id.toString() || "unknown";

  // Show "typing" or "recording" action
  if (ctx.session.preference === "voice") {
    await ctx.replyWithChatAction("record_voice");
  } else {
    await ctx.replyWithChatAction("typing");
  }

  try {
    ctx.session.history.push({ role: "user", content: text });
    if (ctx.session.history.length > 6) {
      ctx.session.history = ctx.session.history.slice(-6);
    }

    // Get AI response + stress analysis
    const result = await askSherpa(ctx.session.history);
    const { answer, analysis } = result;

    // Save analytics (non-blocking)
    saveAnalytics(userId, analysis.stress_score, analysis.sentiment).catch(
      console.error,
    );

    // Conditional output based on preference
    if (ctx.session.preference === "voice") {
      console.log(`[Bot] 🎙️ Voice Mode: Generating audio...`);
      try {
        const audioBuffer = await generateVoice(answer);
        await ctx.replyWithVoice(
          new InputFile(audioBuffer, "sherpa_voice.mp3"),
        );
      } catch (e) {
        console.error("TTS Failed:", e);
        // Fallback to text if audio fails
        await ctx.reply(answer);
      }
    } else {
      // TEXT MODE
      await ctx.reply(answer);
    }

    // Update history
    ctx.session.history.push({ role: "assistant", content: answer });
  } catch (err) {
    console.error("Flow Error:", err);
    await ctx.reply("Lo siento, he tenido un pequeño error.");
  }
}

bot.on("message:text", async (ctx: MyContext) => {
  await handleFlow(ctx, ctx.message.text);
});

bot.on("message:voice", async (ctx: MyContext) => {
  // If they send a voice note, assume they want voice responses
  if (!ctx.session.preference) ctx.session.preference = "voice";

  const file = await ctx.getFile();
  const fileUrl = `https://api.telegram.org/file/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/${file.file_path}`;
  const audioResp = await fetch(fileUrl);
  const audioBlob = await audioResp.blob();

  const transcription = await openai.audio.transcriptions.create({
    file: new File([audioBlob], "voice.ogg", { type: "audio/ogg" }),
    model: "whisper-1",
  });

  await handleFlow(ctx, transcription.text);
});

// --- Shared Logic for Web Chat ---
async function getSherpaLogic(
  text: string, 
  history: Array<{ role: "user" | "assistant"; content: string }>, 
  userId: string
) {
  const currentHistory = [...history, { role: "user", content: text }].slice(-6);
  const result = await askSherpa(currentHistory);
  const { answer, analysis } = result;
  saveAnalytics(userId, analysis.stress_score, analysis.sentiment).catch(console.error);
  return { 
    answer, 
    analysis, 
    updatedHistory: [...currentHistory, { role: "assistant", content: answer }] 
  };
}

// --- Server Setup ---
const handleUpdate = webhookCallback(bot, "std/http", {
  timeoutMilliseconds: 60000,
});

serve(async (req: Request) => {
  // PREFLIGHT HANDLER for CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const clonedReq = req.clone();
    const body = await req.json();

    // WEB CHAT LOGIC
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

    // TELEGRAM LOGIC (with webhook secret check)
    const url = new URL(req.url);
    if (
      url.searchParams.get("secret") !== Deno.env.get("TELEGRAM_WEBHOOK_SECRET")
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    return await handleUpdate(clonedReq);

  } catch (err: unknown) {
    console.error("Server Error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 200, // Return 200 for CORS
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
