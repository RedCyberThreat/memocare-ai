import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import "dotenv/config";

const supabase = createClient(
  process.env.REMOTE_SUPABASE_URL,
  process.env.REMOTE_SUPABASE_SERVICE_ROLE_KEY,
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DATA_DIR = path.join(process.cwd(), "data");

async function processFiles() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".txt"));

  console.log(`🗑️  Wiping existing knowledge base...`);
  const { error: deleteError } = await supabase
    .from("knowledge_base")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) {
    console.error("❌ Error wiping DB:", deleteError);
    return;
  }
  console.log(`✨ Database wiped. Starting fresh.`);

  console.log(`🚀 Starting smart ingestion for ${files.length} files...`);

  for (const file of files) {
    console.log(`Processing: ${file}`);
    const text = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");

    // --- 1. EXTRACT METADATA FROM FILE CONTENT ---
    // We use Regex to grab the exact values provided by the scraper
    const titleMatch = text.match(/^Title:\s*(.+)$/m);
    const urlMatch = text.match(/^URL Source:\s*(.+)$/m);

    // Fallbacks in case the file format differs slightly
    let topic = titleMatch
      ? titleMatch[1].trim()
      : file.replace(/-/g, " ").replace(".md", "").toUpperCase();
    let url = urlMatch
      ? urlMatch[1].trim()
      : `https://blog.fpmaragall.org/${file.replace(".md", "")}`;

    // --- 2. SEPARATE METADATA HEADER FROM BODY ---
    // r.jina.ai usually separates headers from body with "Markdown Content:"
    const contentMarker = "Markdown Content:";
    const markerIndex = text.indexOf(contentMarker);

    let bodyText = text;
    if (markerIndex !== -1) {
      // Slice everything AFTER "Markdown Content:"
      bodyText = text.substring(markerIndex + contentMarker.length).trim();
    }

    // --- 3. SMART CHUNKING ---
    const chunks = bodyText
      .split(/\n\s*\n/) // Split by paragraphs
      .filter((chunk) => chunk.trim().length > 50) // Remove empty/tiny noise
      .map((chunk) => {
        // 💉 THE INJECTION: Burn the REAL Metadata into the text
        return `[TOPIC: ${topic}]
URL Source: ${url}

${chunk.trim()}`;
      });

    // --- 4. EMBED & UPLOAD ---
    for (const chunkContent of chunks) {
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunkContent,
      });
      const embedding = embeddingResponse.data[0].embedding;

      const { error } = await supabase.from("knowledge_base").insert({
        file_name: file,
        content: chunkContent,
        embedding: embedding,
      });

      if (error) console.error(`❌ Error inserting chunk from ${file}:`, error);
    }
  }
  console.log("✅ Smart Ingestion complete! The Brain has been upgraded.");
}

processFiles();
