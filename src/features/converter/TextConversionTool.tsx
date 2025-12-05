
import React, { useEffect, useMemo, useState } from 'react';
import SectionCard from '../../components/SectionCard/SectionCard';
import ConversionSummary from './ConversionSummary';
import { convertSuperscripts } from './utils/superscriptConverter';
import { persistence } from '../../utils/persistence';
import './TextConversionTool.css';

const STORAGE_KEY = 'text-converter:source';
const SAMPLE_TEXT =
  'Researchers observed steadier heart rates¹² and lower cortisol³⁴ in the intervention group⁵. ' +
  'Participants still reported benefits⁶⁷ after six weeks, outperforming the control arm⁸.';

const TextConversionTool = () => {
  const [sourceText, setSourceText] = useState('');
  const [isRestoring, setIsRestoring] = useState(true);
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const stored = await persistence.getItem(STORAGE_KEY);
        if (stored && active) {
          setSourceText(stored);
        }
      } catch (error) {
        console.error('Failed to restore draft', error);
      } finally {
        if (active) {
          setIsRestoring(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (isRestoring) return;

    let cancelled = false;
    setDraftStatus('saving');

    (async () => {
      try {
        if (sourceText) {
          await persistence.setItem(STORAGE_KEY, sourceText);
        } else {
          await persistence.removeItem(STORAGE_KEY);
        }
        if (!cancelled) {
          setDraftStatus(sourceText ? 'saved' : 'idle');
        }
      } catch (error) {
        console.error('Failed to persist draft', error);
        if (!cancelled) {
          setDraftStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sourceText, isRestoring]);

  useEffect(() => {
    if (copyStatus === 'idle') return;
    const timeout = window.setTimeout(() => setCopyStatus('idle'), 2000);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const conversion = useMemo(() => convertSuperscripts(sourceText), [sourceText]);

  const draftStatusLabel = (() => {
    switch (draftStatus) {
      case 'saving':
        return 'Saving…';
      case 'saved':
        return 'Draft saved';
      case 'error':
        return 'Save failed';
      default:
        return 'Auto-save ready';
    }
  })();

  const handleCopy = async () => {
    if (!conversion.converted.trim()) {
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(conversion.converted);
      setCopyStatus('success');
    } catch (error) {
      console.error('Copy failed', error);
      setCopyStatus('error');
    }
  };

  const handleSample = () => {
    setSourceText(SAMPLE_TEXT);
  };

  const handleClear = () => {
    setSourceText('');
  };

  const inputPlaceholder = isRestoring
    ? 'Restoring your last draft…'
    : 'Paste or type text with superscript footnotes (e.g., ¹²³)';

  return (
    <div className="text-conversion-tool">
      <SectionCard
        title="Source text"
        description="Paste your document or paragraph. Superscript citation numbers are detected automatically."
        emphasize
        actions={<span className={`badge badge--${draftStatus}`}>{draftStatusLabel}</span>}
      >
        <textarea
          className="tool-textarea"
          placeholder={inputPlaceholder}
          value={sourceText}
          onChange={(event) => setSourceText(event.target.value)}
          rows={12}
        />

        <div className="tool-helper-row">
          <div className="tool-helper-row__meta">
            <span>{sourceText.length} characters</span>
            {conversion.replacements > 0 && (
              <span>{conversion.replacements} superscript sequences detected</span>
            )}
          </div>

          <div className="tool-helper-row__actions">
            <button type="button" className="ghost-button" onClick={handleSample}>
              Try sample text
            </button>
            <button type="button" className="ghost-button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Conversion summary"
        description="A quick health check before you copy the cleaned text."
      >
        <ConversionSummary
          replacements={conversion.replacements}
          digitsTransformed={conversion.digitsTransformed}
          references={conversion.references}
          characterCount={sourceText.length}
        />
      </SectionCard>

      <SectionCard
        title="Converted output"
        description="Square-bracket citations are live-updated as you edit."
        actions={
          <button
            type="button"
            className={`primary-button ${
              copyStatus === 'success'
                ? 'primary-button--success'
                : copyStatus === 'error'
                  ? 'primary-button--error'
                  : ''
            }`}
            onClick={handleCopy}
            disabled={!conversion.converted.trim()}
          >
            {copyStatus === 'success'
              ? 'Copied!'
              : copyStatus === 'error'
                ? 'Copy failed'
                : 'Copy converted text'}
          </button>
        }
      >
        <textarea
          className="tool-output"
          value={conversion.converted}
          readOnly
          rows={12}
          placeholder="Your converted text will appear here."
        />
        <p className="tool-note">
          Conversion runs instantly in your browser—no uploads, no waiting. Perfect for manuscripts, reports,
          and markdown-based workflows.
        </p>
      </SectionCard>
    </div>
  );
};

export default TextConversionTool;
