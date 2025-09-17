import {GoogleGenerativeAI} from '@google/generative-ai';
import { GeminiTranslationWebSocketClient } from './translationWebSocketClient';

// Real-time translation using Gemini Flash WebSocket streaming
// WebSocket-only streaming translation via backend proxy
let wsClient: GeminiTranslationWebSocketClient | null = null;
export const resetWebSocketClient = () => {
  if (wsClient) {
    wsClient.close();
    wsClient = null;
  }
};

export const streamTranslateText = (
  inputText: string,
  onData: (partial: string) => void,
  onDone?: () => void,
  onError?: (err: any) => void,
  onStreaming?: (streaming: boolean) => void
) => {
  // Always create a new client to avoid stale connections after refresh
  if (wsClient) {
    wsClient.close();
  }
  wsClient = new GeminiTranslationWebSocketClient();
  wsClient.connect({ onData, onDone, onError, onStreaming });
  const waitForOpen = setInterval(() => {
    if (wsClient && wsClient['ws'] && wsClient['ws'].readyState === WebSocket.OPEN) {
      wsClient.sendText(inputText);
      clearInterval(waitForOpen);
    }
  }, 10);
};

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Language list removed, always translate to English

console.log('Gemini API Key:', process.env.REACT_APP_GEMINI_API_KEY);

export const translateText = async (
  inputText: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> => {
  try {
    const prompt = `You are a language expert. Translate the following text to English. Provide only the translation, no explanations or additional text.\nText: "${inputText}"`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error: any) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed: ${error.message || error.toString()}`);
  }
};