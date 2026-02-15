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

// 1. Updated Session Data
interface SessionData {
  history: { role: "user" | "assistant"; content: string }[];
  preference?: "text" | "voice"; // New field
}
type MyContext = Context & SessionFlavor<SessionData>;

const bot = new Bot<MyContext>(Deno.env.get("TELEGRAM_BOT_TOKEN")!);
const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

bot.use(session({ initial: () => ({ history: [] }) }));

/**
 * handleFlow: Now respects the user's preference for voice/text
 */
async function handleFlow(ctx: MyContext, text: string) {
  const userId = ctx.from?.id.toString() || "unknown";

  // Always show "typing" or "recording" so the user knows Sherpa is working
  if (ctx.session.preference === "voice") {
    await ctx.replyWithChatAction("record_voice");
  } else {
    await ctx.replyWithChatAction("typing");
  }

  try {
    ctx.session.history.push({ role: "user", content: text });
    if (ctx.session.history.length > 6)
      ctx.session.history = ctx.session.history.slice(-6);

    // 1. Get Brain Response + Stress Analysis
    const result = await askSherpa(ctx.session.history);
    const { answer, analysis } = result;

    // 2. Persistence (Non-blocking)
    saveAnalytics(userId, analysis.stress_score, analysis.sentiment).catch(
      console.error,
    );

    // 3. Conditional Output Logic
    if (ctx.session.preference === "voice") {
      // VOICE MODE: Only send the audio
      console.log(`[Bot] 🎙️ Voice Mode: Skipping text, generating audio...`);
      try {
        const audioBuffer = await generateVoice(answer);
        await ctx.replyWithVoice(
          new InputFile(audioBuffer, "sherpa_voice.mp3"),
        );
      } catch (e) {
        console.error("TTS Failed:", e);
        // Fallback: If audio fails, send text so the user isn't left in silence
        await ctx.reply(answer);
      }
    } else {
      // TEXT MODE: Only send the text
      await ctx.reply(answer);
    }

    // 4. Update History (Assistant content)
    ctx.session.history.push({ role: "assistant", content: answer });
  } catch (err) {
    console.error("Flow Error:", err);
    await ctx.reply("Lo siento, he tenido un pequeño error.");
  }
}

// --- COMMANDS & HANDLERS ---

bot.command("start", (ctx) => {
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

  // Botons amb etiquetes multilingües per a la màxima claredat
  const keyboard = new InlineKeyboard()
    .text("✍️ Texto / Text / Testo", "pref_text")
    .row() // Posa el següent botó a una fila nova
    .text("🎙️ Voz / Veu / Voce / Voice", "pref_voice");

  ctx.reply(welcomeText, { parse_mode: "Markdown", reply_markup: keyboard });
});

bot.callbackQuery(/^pref_/, async (ctx) => {
  const choice = ctx.callbackQuery.data === "pref_voice" ? "voice" : "text";
  ctx.session.preference = choice;

  // Resposta de confirmació multilingüe curta
  const confirmation =
    choice === "voice"
      ? "🎙️ OK! (Voice Mode / Modo Voz / Modo Veu)"
      : "✍️ OK! (Text Mode / Modo Texto / Modo Text)";

  await ctx.answerCallbackQuery();
  await ctx.reply(confirmation);
});

// Handle the button clicks
bot.callbackQuery(/^pref_/, async (ctx) => {
  const choice = ctx.callbackQuery.data === "pref_voice" ? "voice" : "text";
  ctx.session.preference = choice;

  const confirmation =
    choice === "voice"
      ? "✅ Modo Voz activado. Te responderé con notas de audio."
      : "✅ Modo Texto activado. Me comunicaré contigo por escrito.";

  await ctx.answerCallbackQuery();
  await ctx.reply(confirmation);
});

bot.on("message:text", (ctx) => handleFlow(ctx, ctx.message.text));

bot.on("message:voice", async (ctx) => {
  // If they send a voice note, we assume they want to hear a voice back!
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

// --- Server Setup ---
const handleUpdate = webhookCallback(bot, "std/http", {
  timeoutMilliseconds: 60000,
});

serve(async (req) => {
  const url = new URL(req.url);
  if (
    url.searchParams.get("secret") !== Deno.env.get("TELEGRAM_WEBHOOK_SECRET")
  ) {
    return new Response("Unauthorized", { status: 401 });
  }
  return await handleUpdate(req);
});
