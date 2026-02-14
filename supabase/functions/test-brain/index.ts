import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { askSherpa } from "../telegram-bot/rag_service.ts";

serve(async (req) => {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response("Please provide a 'message' in your JSON body.", { status: 400 });
    }

    console.log(`🧠 Asking Sherpa (Test Mode): "${message}"...`);

    const fakeHistory = [{ role: "user" as const, content: message }];

    // ⚡️ THE FIX IS HERE: Destructure the object returned by askSherpa
    const { answer, analysis } = await askSherpa(fakeHistory);

    // Optional: Log the analysis in the terminal so you can see it working!
    console.log(`📊 Internal Analysis: Stress=${analysis.stress_score}, Sentiment=${analysis.sentiment}`);

    // Return only the answer string to the curl
    return new Response(answer, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
});
