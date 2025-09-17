

import React, { useEffect } from 'react';
import LiveTranslate from './components/Translator';
import ErrorBoundary from './components/ErrorBoundary';

// Always reset WebSocket client on mount (refresh)
import { resetWebSocketClient } from './helpers';


function App() {
  useEffect(() => {
    document.body.classList.add('dark');
    resetWebSocketClient();
  }, []);

  return (
    <ErrorBoundary>
      <LiveTranslate />
    </ErrorBoundary>
  );
}

export default App;