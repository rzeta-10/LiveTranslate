
# LiveTranslate — Gemini-Powered Real-Time English Translation

LiveTranslate is a modern, real-time translation app built with **React** and **TypeScript**, powered by **Google's Gemini AI**. It features **voice input** (speech-to-text), **voice output** (text-to-speech), and a sleek UI built using Tailwind CSS. All translations are automatically performed **to English**.

## Features

- Real-time translation of any spoken or typed language **to English**
- Voice input (speech-to-text) using the Web Speech API
- Voice output (text-to-speech) using the SpeechSynthesis API
- Live streaming captions as translation is received
- Modern, responsive UI with Tailwind CSS
- Error handling and connection status indicators
- Integration with Google's Gemini AI (Gemini Flash model)
- Node.js WebSocket backend proxy for secure Gemini API access

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A **Gemini API key** from [Google AI Studio](https://makersuite.google.com/)

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd livetranslate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add your Gemini API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the backend WebSocket proxy:**
   ```bash
   node server.js
   ```
   By default, the proxy runs on `ws://localhost:8080` and securely connects to Gemini Flash using your API key.

5. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

- `REACT_APP_GEMINI_API_KEY`: Your Gemini API key from Google AI Studio (required for frontend translation requests)
- `GEMINI_API_KEY`: Your Gemini API key (required for backend WebSocket proxy in `server.js`)

## Available Scripts

- `npm start`: Runs the React app in development mode
- `npm run build`: Builds the app for production
- `node server.js`: Starts the Node.js WebSocket proxy for Gemini streaming translation

## Architecture

```
User <-> React Frontend <-> WebSocket Proxy (Node.js) <-> Gemini Flash API
```

- The **frontend** connects to the backend WebSocket proxy for real-time streaming translation.
- The **backend** (`server.js`) securely proxies translation requests to Gemini Flash, streaming results back to the frontend.
- All translations are performed **to English**. There is no language selection or swapping.

## Browser Support

The application uses the following Web APIs:
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for speech recognition (voice input)
- [SpeechSynthesis API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) for text-to-speech (voice output)

> **Note:** These APIs are supported in most modern browsers (Chrome, Edge, Safari). Firefox does **not** support the Web Speech API for speech recognition.

## Technologies Used

- React + TypeScript
- Tailwind CSS
- Google Gemini AI (Gemini Flash model)
- Node.js (WebSocket proxy)
- Web Speech API, SpeechSynthesis API

## Limitations & Notes

- **All translations are to English.** There is no language selection or swapping.
- The backend proxy is required to access Gemini Flash securely from the frontend.
- The app is for demonstration/educational use. Do not expose your API key in production.
- Streaming translation requires a stable internet connection.

## Troubleshooting

- If you see "Could not connect to translation server", ensure the backend WebSocket proxy (`server.js`) is running and accessible.
- If speech recognition does not work, check your browser compatibility and permissions.
- For Gemini API errors, verify your API key and quota in Google AI Studio.
