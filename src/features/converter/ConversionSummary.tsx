
import React from 'react';
import './ConversionSummary.css';

type ConversionSummaryProps = {
  replacements: number;
  digitsTransformed: number;
  references: string[];
  characterCount: number;
};

const ConversionSummary = ({
  replacements,
  digitsTransformed,
  references,
  characterCount,
}: ConversionSummaryProps) => {
  const uniqueReferences = Array.from(new Set(references));
  const sampleRefs = uniqueReferences.slice(0, 6);

  const summaryState = (() => {
    if (characterCount === 0) return 'Paste text to begin.';
    if (replacements === 0) return 'No superscript digits detected yet.';
    return 'Clean, bracketed references are ready.';
  })();

  return (
    <div className="conversion-summary">
      <div className="conversion-summary__status">{summaryState}</div>

      <div className="conversion-summary__grid">
        <div className="summary-card">
          <span className="summary-card__label">Superscript sequences</span>
          <strong className="summary-card__value">{replacements}</strong>
          <span className="summary-card__hint">
            Number of superscript clusters that were converted to bracketed references.
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-card__label">Digits normalized</span>
          <strong className="summary-card__value">{digitsTransformed}</strong>
          <span className="summary-card__hint">
            Total superscript digits converted to plain numbers.
          </span>
        </div>

        <div className="summary-card">
          <span className="summary-card__label">Unique references</span>
          <strong className="summary-card__value">{uniqueReferences.length}</strong>
          <span className="summary-card__hint">
            Distinct citation identifiers discovered in the text.
          </span>
        </div>
      </div>

      {sampleRefs.length > 0 && (
        <div className="conversion-summary__references">
          <span className="conversion-summary__references-label">Converted references:</span>
          <div className="conversion-summary__chips">
            {sampleRefs.map((ref) => (
              <span key={ref} className="conversion-summary__chip">
                [{ref}]
              </span>
            ))}
            {uniqueReferences.length > sampleRefs.length && (
              <span className="conversion-summary__chip conversion-summary__chip--muted">
                +{uniqueReferences.length - sampleRefs.length} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionSummary;
