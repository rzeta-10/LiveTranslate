// src/helpers/translationWebSocketClient.ts
// Frontend WebSocket client for Gemini translation proxy

export type WebSocketTranslationCallbacks = {
  onData: (partial: string) => void;
  onStreaming?: (isStreaming: boolean) => void;
  onDone?: () => void;
  onError?: (err: any) => void;
};

export class GeminiTranslationWebSocketClient {
  private ws: WebSocket | null = null;
  private callbacks: WebSocketTranslationCallbacks | null = null;

  connect(callbacks: WebSocketTranslationCallbacks) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.callbacks = callbacks;
      return;
    }
    this.ws = new WebSocket('ws://localhost:8080');
    this.callbacks = callbacks;
    this.ws.onopen = () => {
      // Ready to send text
    };
    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.streaming === 'boolean' && this.callbacks?.onStreaming) {
          this.callbacks.onStreaming(data.streaming);
        }
        if (data.partial && this.callbacks?.onData) {
          this.callbacks.onData(data.partial);
        }
        if (data.done && this.callbacks?.onDone) {
          this.callbacks.onDone();
        }
        if (data.error && this.callbacks?.onError) {
          this.callbacks.onError(data.error);
        }
      } catch (err) {
        this.callbacks?.onError && this.callbacks.onError(err);
      }
    };
    this.ws.onerror = (event: Event) => {
      this.callbacks?.onError && this.callbacks.onError(event);
    };
    this.ws.onclose = () => {
      this.callbacks?.onDone && this.callbacks.onDone();
    };
  }

  sendText(inputText: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ text: inputText }));
    }
  }

  close() {
    this.ws?.close();
  }
}
