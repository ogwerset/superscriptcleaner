
import React from 'react';
import './App.css';
import TextConversionTool from './features/converter/TextConversionTool';

function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <p className="hero__eyebrow">Superscript Cleaner</p>
        <h1>Turn superscript footnotes into clean bracketed references.</h1>
        <p className="hero__subtitle">
          Paste any text that contains superscript citation numbers (like ¹²³) and instantly convert them
          into square brackets that are ready for technical manuscripts, academic writing, or markdown.
        </p>
      </header>

      <main className="main-content">
        <TextConversionTool />
      </main>

      <footer className="app-footer">
        <p>
          Crafted for accuracy-first writers. No sign-up, no uploads—everything runs safely in your browser.
        </p>
      </footer>
    </div>
  );
}

export default App;
