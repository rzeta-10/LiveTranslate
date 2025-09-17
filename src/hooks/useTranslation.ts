import { useState } from 'react';
import { translateText } from '../helpers';


interface UseTranslationReturn {
  translatedText: string;
  isTranslating: boolean;
  isStreaming: boolean;
  isConnected: boolean;
  error: string;
  setError: (error: string) => void;
  handleTranslate: (inputText: string) => Promise<void>;
  setTranslatedText: (text: string) => void;
  streamTranslate: (inputText: string) => void;
  chunks: string[];
}

export const useTranslation = (): UseTranslationReturn => {
  const [translatedText, setTranslatedText] = useState('');
  const [chunks, setChunks] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async (
    inputText: string
  ): Promise<void> => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    setError('');

    try {
      // Always translate to English
  const translation = await translateText(inputText, 'auto', 'en');
      setTranslatedText(translation);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Real-time streaming translation using WebSocket
  // removed unused wsInitialized
  const streamTranslate = (inputText: string) => {
    setIsTranslating(true);
    setError('');
    setTranslatedText('');
    setChunks([]);
    setIsStreaming(false);
    setIsConnected(false);
    try {
      import('../helpers').then(({ streamTranslateText }) => {
        let connected = false;
        streamTranslateText(
          inputText,
          (partial) => {
            setChunks((prev) => {
              if (prev.length === 0 || prev[prev.length - 1] !== partial) {
                return [...prev, partial];
              }
              return prev;
            });
            setTranslatedText(partial);
          },
          () => {
            setIsTranslating(false);
            setIsStreaming(false);
          },
          (err) => {
            let msg = 'Streaming translation failed.';
            if (err && (err.message?.includes('ECONNREFUSED') || err.type === 'error')) {
              msg = 'Could not connect to translation server. Please ensure the backend is running.';
              setIsConnected(false);
            }
            setError(msg);
            setIsTranslating(false);
            setIsStreaming(false);
            console.error('Streaming translation error:', err);
          },
          (streaming: boolean) => {
            setIsStreaming(streaming);
            if (!connected && streaming) {
              setIsConnected(true);
              connected = true;
            }
          }
        );
      });
    } catch (err) {
      setError('Could not connect to translation server. Please ensure the backend is running.');
      setIsTranslating(false);
      setIsStreaming(false);
      setIsConnected(false);
      console.error('Streaming translation error:', err);
    }
  };

  return {
    translatedText,
    chunks,
    isTranslating,
    isStreaming,
    isConnected,
    error,
    setError,
    handleTranslate,
    setTranslatedText,
    streamTranslate,
  };
}; 