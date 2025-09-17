// src/helpers/translationWebSocket.ts
// WebSocket-based real-time translation for Gemini Flash

export type WebSocketTranslationCallbacks = {
  onData: (partial: string) => void;
  onDone?: () => void;
  onError?: (err: any) => void;
};

export class GeminiTranslationWebSocket {
  private ws: WebSocket | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  connect(inputText: string, callbacks: WebSocketTranslationCallbacks) {
    // NOTE: Replace this URL with the actual Gemini Flash WebSocket endpoint if available
    const wsUrl = 'wss://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=' + this.apiKey;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      const payload = {
        contents: [{ role: 'user', parts: [{ text: `You are a language expert. Translate the following text to English. Provide only the translation, no explanations or additional text.\nText: "${inputText}"` }] }],
      };
      this.ws?.send(JSON.stringify(payload));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Gemini Flash streaming response format may differ; adjust as needed
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          callbacks.onData(data.candidates[0].content.parts[0].text);
        }
        if (data.done) {
          callbacks.onDone && callbacks.onDone();
          this.ws?.close();
        }
      } catch (err) {
        callbacks.onError && callbacks.onError(err);
      }
    };

    this.ws.onerror = (event) => {
      callbacks.onError && callbacks.onError(event);
    };

    this.ws.onclose = () => {
      callbacks.onDone && callbacks.onDone();
    };
  }

  close() {
    this.ws?.close();
  }
}
