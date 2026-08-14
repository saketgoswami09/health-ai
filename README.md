# AI Health Assistant Boilerplate

## 1. Project Overview

This is a technical assessment boilerplate for a **Conversational AI Health-Screening Application**. It provides a clean, monorepo-style foundation with a React/Vite/TypeScript frontend and a Node.js/Express/TypeScript backend. 

The goal of this application is to allow users to have a live voice conversation with an AI agent. After the call concludes, the system generates a structured, actionable health report based on the conversation.

## 2. Architecture

This project uses a decoupled frontend-backend architecture:

- **Client**: A single-page application built with React and Vite. It handles the UI for starting the call, displaying real-time voice status, and rendering the final health report.
- **Server**: A REST API built with Express. It will act as the orchestrator, communicating with the OpenAI Realtime API for the conversation, and the standard OpenAI text models to generate the final report.

## 3. Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Icons)

### Backend
- Node.js
- Express
- TypeScript
- CORS / Dotenv

## 4. Folder Structure

```text
health-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page layouts (Home, VoiceCall, Report)
│   │   ├── services/       # API clients and external integrations
│   │   ├── types/          # Shared TypeScript interfaces
│   │   ├── App.tsx         # Main application flow
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/         # Environment variables configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom Express middleware (Error handling)
│   │   ├── routes/         # Express router definitions
│   │   ├── services/       # Core business logic (AI, Realtime, Reports)
│   │   ├── types/          # Shared TypeScript interfaces
│   │   ├── utils/          # Utilities (Logger)
│   │   ├── app.ts          # Express application setup
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example
├── package.json            # Root scripts
└── README.md
```

## 5. Local Setup Instructions

1. **Clone the repository.**
2. **Install Frontend Dependencies:**
   ```bash
   cd client
   npm install
   ```
3. **Install Backend Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

## 6. Environment Variables

Create a `.env` file in the root `health-ai` directory (or copy `.env.example`) and configure the following:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your_actual_openai_api_key_here
```

*Note: Never commit your `.env` file or expose your API key on the React frontend.*

## 7. How to run frontend

Navigate to the `client` directory and start the Vite dev server:

```bash
cd client
npm run dev
```

## 8. How to run backend

Navigate to the `server` directory and start the Nodemon dev server:

```bash
cd server
npm run dev
```

*(Alternatively, you can run `npm run start` in the root `health-ai` folder if the root `package.json` scripts are set up).*

## 9. Planned AI / Voice Pipeline

The eventual implementation flow:

**During the Call:**
```text
User Microphone -> WebRTC/WebSocket -> Node.js Backend -> OpenAI Realtime API -> AI Voice Response -> User Speaker
```

**After the Call:**
```text
Conversation Transcript -> reportService (Node.js) -> OpenAI GPT-4o (Structured JSON) -> React UI (HealthReportComponent)
```

## 10. Future Implementation Steps (Next Priorities)

1. **`client/src/services/voiceService.ts`**: Implement the WebRTC connection logic to stream audio from the user's microphone.
2. **`server/src/services/realtimeService.ts`**: Implement the WebSocket connection to the OpenAI Realtime API.
3. **`server/src/services/reportService.ts` & `aiService.ts`**: Send the conversation transcript to the OpenAI completions endpoint to generate a JSON-structured health report.
4. **`client/src/pages/VoiceCall.tsx`**: Hook up the real voice service to the UI state instead of using mock timeouts.
# health-ai
