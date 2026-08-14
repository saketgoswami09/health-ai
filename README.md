# Health AI Voice Screening

A React and Node.js application for a short, live AI health-screening call. The user speaks to an ElevenLabs Conversational AI agent, then receives a structured report based on the captured conversation.

## What it does

- Starts and ends a real-time browser voice conversation.
- Uses ElevenLabs Conversational AI over WebRTC for microphone input, speech-to-text, agent reasoning, and speech output.
- Shows the conversation transcript in the call UI.
- Generates a structured health report after the call ends.
- Handles incomplete calls safely with `Not discussed` values rather than inventing information.
- Flags a small set of potentially urgent symptoms with an urgent-care recommendation.

## Architecture

```text
Browser (React)
  -> Node.js token endpoint
  -> ElevenLabs Conversational AI Agent (WebRTC)
  -> transcript captured in React
  -> Node.js POST /api/reports
  -> structured health report
```

The ElevenLabs API key stays on the Node.js server. The browser receives only a short-lived conversation token.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Voice provider: ElevenLabs Conversational AI (`@elevenlabs/client`)

## Prerequisites

- Node.js 20 or later
- An ElevenLabs account
- An ElevenLabs Conversational AI agent
- An ElevenLabs API key with `convai_write` permission

## Setup

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Create `server/.env` from the root `.env.example`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_AGENT_ID=agent_your_agent_id_here
```

Never commit the `.env` file or expose the API key in the frontend.

## Configure the ElevenLabs agent

Create an agent in the ElevenLabs dashboard and set its prompt to conduct a brief health intake. It should:

1. Greet the user and ask one question at a time.
2. Collect their name, main concern, duration, severity, and related symptoms.
3. Ask relevant follow-up questions when an answer is unclear.
4. Avoid diagnosing or prescribing treatment.
5. Tell users to contact local emergency services if they describe an emergency.

Use the resulting `agent_...` value as `ELEVENLABS_AGENT_ID`.

## Run locally

Start the backend:

```bash
cd server
npm run dev
```

In another terminal, start the frontend:

```bash
cd client
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Backend health check |
| `GET` | `/api/elevenlabs/conversation-token` | Creates a short-lived token for the browser voice session |
| `POST` | `/api/reports` | Creates a structured report from conversation messages |

Example report request:

```json
{
  "sessionId": "session-id",
  "conversationData": [
    {
      "id": "1",
      "role": "user",
      "content": "I have had a severe headache for two days.",
      "timestamp": "2026-08-14T00:00:00.000Z"
    }
  ]
}
```

## Report behavior

The report service processes the user transcript into main concern, symptoms, duration, severity, supporting details, and follow-up guidance. It uses conservative extraction logic, so missing information is represented as `Not discussed`. This prevents the application from filling gaps with made-up clinical facts.

## Limitations and next improvements

- The current report extraction is deterministic. A dedicated LLM with validated structured output would produce richer summaries.
- The report is a screening summary, not a diagnosis or medical advice.
- Add visible retry/error states for microphone, connection, and report failures.
- Add automated tests for report extraction and API routes.
- Configure Hindi or multilingual handling in the ElevenLabs agent for language support.
