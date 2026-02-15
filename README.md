# **Memocare AI: Sherpa Digital Companion**

Memocare AI is a cross-platform digital assistant designed to provide empathetic, source-backed support for Alzheimer's patients and their caregivers. The system, named **"Sherpa"**, operates through a synchronized web interface and a Telegram bot, offering real-time guidance based on specialized Alzheimer's care protocols.

## **🚀 Overview**

The project leverages a **Retrieval-Augmented Generation (RAG)** architecture to ensure that every response is grounded in verified medical and caregiving contexts. It features a "silent analysis" system that monitors user stress levels and sentiment to adapt its tone and prioritize urgent needs.

## **🛠 Tech Stack**

* **Frontend**: React (Vite), Tailwind CSS, Shadcn UI.  
* **Backend**: Supabase Edge Functions (Deno).  
* **AI Engine**:  
  * **OpenAI GPT-4o-mini**: Core reasoning and response generation.  
  * **OpenAI Embeddings**: Semantic search capabilities.  
  * **Cohere Rerank**: Multilingual re-ranking for high-precision context retrieval.  
  * **Whisper & TTS**: Speech-to-text and text-to-speech for voice-based interaction.  
* **Telegram Bot**: Built with the GrammY framework.  
* **Database**: Supabase (PostgreSQL) with pgvector for hybrid search and analytics storage.

## **✨ Key Features**

* **Multi-Platform Sync**: Users can switch between the web application and Telegram without losing context.  
* **Empathetic RAG**: Responses are strictly limited to provided care contexts to prevent hallucinations, delivered with a patient and calm tone.  
* **Voice Interaction**: Full support for voice messages on Telegram with automated transcription and voice replies.  
* **Emotional Intelligence**: Every interaction triggers a hidden stress and sentiment analysis saved to a dashboard for caregiver monitoring.  
* **Multilingual Support**: Automatically detects and responds in the user's language (Spanish, Catalan, Italian, English).

## **📂 Project Structure**

* /src: React frontend application.  
* /supabase/functions/telegram-bot:  
  * index.ts: The main "switchboard" handling Webhooks and Web-chat requests.  
  * rag\_service.ts: The logic for embeddings, hybrid retrieval, re-ranking, and TTS.  
  * prompt.ts: The specialized system prompt defining "Sherpa's" behavior and analysis rules.

## **⚙️ Setup & Deployment**

### **Environment Variables**

The following secrets must be configured in your .env (Local) and Supabase Secrets (Cloud):

* OPENAI\_API\_KEY: For GPT-4o-mini and Whisper.  
* COHERE\_API\_KEY: For multilingual re-ranking.  
* TELEGRAM\_BOT\_TOKEN: Provided by @BotFather.  
* TELEGRAM\_WEBHOOK\_SECRET: A custom secret to secure your endpoint.

### **Backend Deployment**

Deploy the AI brain to Supabase Edge Functions:

PowerShell

npx supabase functions deploy telegram\-bot \-\-no-verify-jwt

### **Frontend Deployment**

The frontend is optimized for **Vercel**. Ensure VITE\_SUPABASE\_URL and VITE\_SUPABASE\_ANON\_KEY are set in the Vercel dashboard.

## **🤝 Care Protocols**

Sherpa is trained to follow strict constraints:

* Use **only** information found in the retrieved context.  
* Cite exact source URLs for transparency.  
* Adapt tone for stressed caregivers (more friendly) vs. patient interactions (simpler sentences).

---

*Developed for the Alzheimer's Care Hackathon.*
