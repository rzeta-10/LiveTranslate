import React, { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTranslation } from '../hooks/useTranslation';
import { speakText } from '../utils/speechSynthesis';
import { MicrophoneIcon, StopIcon, SpinnerIcon, PlayIcon } from './icons';

const LiveTranslate: React.FC = () => {
  const [inputText, setInputText] = useState('');

  // Always translate to English, no language selection

  const {
    translatedText,
    isTranslating,
    isStreaming,
    isConnected,
    error: translationError,
    streamTranslate,
    chunks,
  } = useTranslation();

  const {
    isListening,
    startListening: startSpeechRecognition,
    error: speechError,
  } = useSpeechRecognition('auto');

  const error = translationError || speechError;

  // When speech is recognized, stream-translate it immediately
  const handleSpeechResult = (speechText: string) => {
    // Always send the full transcript, do not filter or modify
    setInputText(speechText);
    streamTranslate(speechText);
  };

  const handleStartListening = () => {
    setInputText('');
    startSpeechRecognition(handleSpeechResult);
  } 

  const handleSpeakText = (text: string) => {
    speakText(text, 'en');
  };

  // Real-time translation: stream as user types
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputText(value);
    if (value.trim()) {
      streamTranslate(value);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Connection status banner */}
      <div className="flex justify-end mb-2">
        {isConnected ? (
          <span className="flex items-center gap-1 text-green-400 text-xs font-semibold"><span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />Connected</span>
        ) : (
          <span className="flex items-center gap-1 text-red-400 text-xs font-semibold"><span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse" />Disconnected</span>
        )}
      </div>
      <div className="text-center mb-8">
  <h1 className="text-4xl font-bold text-gray-100">LiveTranslate</h1>
  <p className="text-gray-400 mt-2">All translations are automatically to English.</p>
      </div>

      <div className="relative mb-6">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text to translate or click the microphone to speak..."
          className="w-full p-4 border border-gray-700 rounded-lg min-h-[150px] text-base resize-y bg-gray-800 text-gray-100 placeholder-gray-500 transition-colors duration-200"
        />
        <button
          onClick={handleStartListening}
          disabled={isListening}
          className={`absolute bottom-4 right-4 p-3 bg-blue-700 border-none rounded-full cursor-pointer text-white flex items-center justify-center transition-all shadow-md hover:bg-blue-800 hover:scale-105 hover:shadow-lg disabled:bg-gray-700 disabled:cursor-not-allowed disabled:transform-none ${
            isListening ? 'bg-red-700 animate-pulse hover:bg-red-800' : ''
          }`}
          title={isListening ? 'Listening... Click to stop' : 'Click to speak'}
        >
          {isListening ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        </button>
      </div>

  <div className="relative bg-gray-900 p-4 rounded-lg min-h-[150px] mt-6 border-2 border-blue-700 shadow-lg transition-colors duration-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-blue-300 drop-shadow-sm tracking-wide">Live Captions</span>
          {isStreaming && <SpinnerIcon className="animate-spin w-4 h-4 text-blue-300" />}
          {isStreaming && <span className="text-xs text-blue-200 animate-pulse">Streaming...</span>}
        </div>
        <div className="whitespace-pre-wrap m-0 text-lg min-h-[2em] font-mono tracking-wide transition-colors duration-200 text-blue-100 bg-blue-950/40 rounded p-2 shadow-inner">
          {chunks.length > 0 ? (
            chunks.map((chunk, idx) => (
              <span key={idx} className={idx === chunks.length - 1 && isStreaming ? 'bg-blue-800/40 animate-pulse px-1 rounded transition-all duration-300' : 'transition-all duration-300'}>{chunk}</span>
            ))
          ) : (
            isTranslating ? <span className="text-gray-500">Waiting for translation...</span> : <span className="text-gray-500">Type or speak to translate.</span>
          )}
        </div>
        {(chunks.length > 0 || translatedText) && (
          <button
            onClick={() => handleSpeakText(chunks.length > 0 ? chunks.join('') : translatedText)}
            className="absolute bottom-4 right-4 p-2 bg-transparent border-none cursor-pointer text-blue-300 hover:text-white"
          >
            <PlayIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-center mt-4">{error}</div>
      )}
    </div>
  );
};

export default LiveTranslate; 