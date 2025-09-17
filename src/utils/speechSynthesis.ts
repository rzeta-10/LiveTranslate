export const speakText = (text: string, targetLanguage: string): void => {
  const utterance = new SpeechSynthesisUtterance(text);
  // Always use English voice for translated captions
  utterance.lang = 'en-US';
  window.speechSynthesis.speak(utterance);
};