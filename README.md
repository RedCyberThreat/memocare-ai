# ***MemoCare AI: The Cognitive Support Infrastructure***

*"Transforming fragmented clinical knowledge into a trusted, accessible lifeline for Alzheimer's caregivers."*

*Memocare AI is an evidence-first, AI-powered agent designed to bridge the **Information-to-Action Gap** in dementia care. Named **"Sherpa"**, the system provides 24/7 clinical guidance and emotional support through a synchronized Web and Telegram interface.*

### 🌐 Live Links
* **Web Dashboard**: [memocare-ai.vercel.app](https://memocare-ai.vercel.app/)
* **Telegram Bot**: [@AlzheimerSupportBot](https://t.me/AlzheimerSupportBot)
* **Demo Video**: [MemoCare AI Presentation and Demo Video]
* **LM Notebook**: [Interactive Notebook](https://notebooklm.google.com/notebook/c2b6e3f9-f46d-4eac-b873-687de8411f49)

## ***🧠 The Problem***

* ***The Support Gap**: 55M+ people live with dementia globally, with 80% of care falling on unpaid, untrained family members.*  
* ***The Financial Strain**: Families assume 86% of costs, averaging **€42,000/year**.*  
* ***The Information Gap**: Caregivers face "Dr. Google" hallucinations or "Clinical Silence" during midnight crises.*

## ***🛠 Proprietary Architecture: "The Five Pillars"***

*Our RAG (Retrieval-Augmented Generation) pipeline is built on five specialized technical modules:*

1. ***The Ingestor**: Curates authoritative data from sources like the **Fundació Pasqual Maragall**.*  
2. ***Hybrid Eye**: Uses OpenAI Embeddings and `pgvector` for multi-dimensional semantic search.*  
3. ***The Judge**: Employs **Cohere Rerank** to filter noise and ensure only the top 3 relevant facts reach the model.*  
4. ***The Polyglot**: Real-time multilingual support across Spanish, Catalan, Italian, and English.*  
5. ***The Memory**: A sliding window context that maintains the last 6 turns of conversation for seamless interaction.*

## ***✨ Key Features***

* ***Silent Analysis**: Automatically monitors user sentiment and stress on a scale of 1-10 to adapt Sherpa's response tone.*  
* ***Voice-First Care**: Integrated ElevenLabs TTS and Whisper STT for elderly patients who prefer speaking over typing.*  
* ***Caregiver Dashboard**: A web-based interface for adult children to monitor the stress levels and needs of both the patient and the primary caregiver.*  
* ***Clinical Authority**: Every response is grounded in clinical truth, citing exact URLs to prevent AI hallucinations.*

## ***📂 Project Structure***

* *`/src`: React frontend (The Caregiver Dashboard).*  
* *`/supabase/functions/telegram-bot`:*  
  * *`index.ts`: Edge function handling the multi-platform "Switchboard."*  
  * *`rag_service.ts`: The RAG engine (Embeddings \+ Rerank \+ TTS).*  
  * *`prompt.ts`: The specialized "Sherpa" persona and safety protocols.*

## ***🚀 12-Month Roadmap***

* ***Months 0-6 (Validation)**: Launch B2C in Spain/Catalonia; reach 1,000 active users.*  
* ***Months 6-12 (Expansion)**: Launch Caregiver Dashboard Beta and secure 2-3 Institutional Pilots (B2B).*  
* ***Phase 3 (Scale)**: Integration with public health systems for reimbursement models (B2G).*

## ***⚙️ Setup & Deployment***

### ***Environment Variables***

*Configure these in your `.env` and Supabase Secrets:*

* *`OPENAI_API_KEY`: Core LLM & Embeddings.*  
* *`COHERE_API_KEY`: Context re-ranking.*  
* *`TELEGRAM_BOT_TOKEN`: Bot authentication.*  
* *`TELEGRAM_WEBHOOK_SECRET`: Secure endpoint verification.*

### ***Deployment***

* ***Backend**: `npx supabase functions deploy telegram-bot --no-verify-jwt`*  
* ***Frontend**: Optimized for Vercel deployment with Vite.*

---

*Developed by Team Snack Underflow for the OPIT Hackathon 2026\.*
