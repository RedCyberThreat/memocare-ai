import fs from "fs";
import path from "path";

const urls = [
  "https://cercasalut.barcelona/index/deteriorament-cognitiu-i-demencies//",
  "https://blog.fpmaragall.org/ca/que-es-lalzheimer",
  "https://blog.fpmaragall.org/ca/com-es-diagnostica-lalzheimer",
  "https://blog.fpmaragall.org/ca/diferencies-alzheimer-i-demencia",
  "https://blog.fpmaragall.org/ca/quins-son-els-tipus-i-les-causes-de-demencia",
  "https://blog.fpmaragall.org/ca/les-fases-de-la-malaltia-dalzheimer",
  "https://blog.fpmaragall.org/ca/simptomes-cognitius-de-la-malaltia-dalzheimer",
  "https://blog.fpmaragall.org/ca/simptomes-conductuals-de-lalzheimer",
  "https://blog.fpmaragall.org/ca/la-reaccio-davant-el-diagnostic-dalzheimer-i-lacceptacion-de-la-malaltia",
  "https://blog.fpmaragall.org/afasia-del-lenguaje",
  "https://blog.fpmaragall.org/conducir-con-alzheimer",
  "https://blog.fpmaragall.org/ca/com-tractar-a-un-malalt-dalzheimer-la-comunicacio",
  "https://blog.fpmaragall.org/ca/consells-per-a-cuidadors-de-persones-amb-alzheimer-com-comunicar-se-millor-amb-elles",
  "https://blog.fpmaragall.org/ca/la-conducta-com-a-forma-de-comunicacio-en-persones-amb-alzheimer",
  "https://blog.fpmaragall.org/comunicacion-con-personas-dependientes",
  "https://blog.fpmaragall.org/perdida-y-duelo-alzheimer",
  "https://blog.fpmaragall.org/fases-duelo-alzheimer",
  "https://blog.fpmaragall.org/sobrellevar-duelo-perdida-ser-querido",
  "https://blog.fpmaragall.org/ca/dol-coronavirus",
  "https://blog.fpmaragall.org/ca/consells-perque-el-cuidador-duna-persona-amb-alzheimer-aprengui-a-cuidar-se",
  "https://blog.fpmaragall.org/sindrome-del-cuidador-quemado",
  "https://blog.fpmaragall.org/ca/com-els-cuidadors-de-persones-amb-alzheimer-poden-afrontar-la-sensacio-de-sobrecarrega-",
  "https://blog.fpmaragall.org/ca/lansietat-en-cuidadors-de-persones-amb-alzheimer-i-com-aprendre-a-gestionarla",
  "https://blog.fpmaragall.org/ca/recursos-socials-per-a-persones-amb-alzheimer-i-familiars",
  "https://blog.fpmaragall.org/asociacion-alzheimer",
  "https://blog.fpmaragall.org/ca/eines-legals-d-utilitat-per-a-fam%C3%ADlies-i-malalts-d-alzheimer",
  "https://blog.fpmaragall.org/ca/que-son-i-com-fer-la-sollicitud-per-als-ajuts-de-la-llei-de-dependencia",
];


// PLUS YOUTUBE:

// 1: https://www.youtube.com/watch?v=PtbERCyCPQw&t=1396s
// 2: https://youtu.be/uTMSYS0nUBg
// 3: https://www.youtube.com/watch?v=gM501sFR1jA
// 4: https://www.youtube.com/watch?v=X0hYGT2o63g
// 5: https://youtu.be/NYtj7OZGQQ4

const DATA_DIR = path.join(process.cwd(), "data");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

async function extractPages() {
  console.log(`Starting extraction of ${urls.length} pages...`);

  for (let i = 0; i < urls.length; i++) {
    const targetUrl = urls[i];

    // Create a safe file name from the URL
    const safeName = targetUrl.split("/").pop() || `page_${i}`;
    const fileName = `${safeName}.md`;
    const filePath = path.join(DATA_DIR, fileName);

    console.log(`[${i + 1}/${urls.length}] Fetching: ${targetUrl}`);

    try {
      // Prepend r.jina.ai to get the markdown version
      const response = await fetch(`https://r.jina.ai/${targetUrl}`);

      if (!response.ok) {
        console.error(
          `❌ Failed to fetch ${targetUrl}: ${response.statusText}`,
        );
        continue;
      }

      const markdown = await response.text();

      // Save the markdown to your data folder
      fs.writeFileSync(filePath, markdown);
      console.log(`✅ Saved: ${fileName}`);

      // Be polite to the API, wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error processing ${targetUrl}:`, error.message);
    }
  }

  console.log("🎉 All pages extracted successfully!");
  console.log(
    '👉 Next step: Run "node scripts/ingest.js" to push these to Supabase.',
  );
}

extractPages();
