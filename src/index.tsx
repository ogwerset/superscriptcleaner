
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ensurePersistentStorage } from './utils/setupPersistentStorage';

const container = document.getElementById('app');

async function bootstrap() {
  try {
    await ensurePersistentStorage();
  } catch (error) {
    console.warn('Continuing without persistent storage initialization.', error);
  }

  const AppModule = await import('./App');
  const App = AppModule.default;

  if (!container) {
    throw new Error('Root container #app was not found in the document.');
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap Superscript Cleaner.', error);
});
