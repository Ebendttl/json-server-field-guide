import React from 'react';
import { RECORDED_RESPONSES } from './recorded';
import './fg.css';

interface TryItProps {
  request: string;
  dataset?: 'quickstart' | 'tasks';
  title?: string;
}

/**
 * Read-only fixture preview block showing an exact recorded response from recorded.ts.
 * Rendered in MDX guides where live server response is demonstrated.
 */
export function TryIt({ request, dataset, title }: TryItProps) {
  // Normalize request key lookup
  const cleanRequest = request.trim();
  const lookupKey = dataset ? `${dataset}:${cleanRequest}` : cleanRequest;
  const match = RECORDED_RESPONSES[lookupKey] || RECORDED_RESPONSES[cleanRequest];

  if (!match) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[TryIt] Request "${request}" (dataset: ${dataset || 'any'}) not found in recorded fixtures.`
      );
    }
    return null;
  }

  const method = match.method || 'GET';
  const status = match.status || 200;

  return (
    <div className="fg-tryit-block" data-ui>
      <div className="fg-tryit-header">
        <div className="fg-tryit-title">
          <span className="fg-badge-method">{method}</span>
          <code>{cleanRequest}</code>
          {title && <span className="fg-tryit-custom-title">{title}</span>}
        </div>
        <div className="fg-tryit-meta">
          <span className="fg-badge-status">{status} OK</span>
          <span className="fg-badge-recorded">recorded</span>
        </div>
      </div>
      <pre
        className="fg-code-content fg-tryit-pre"
        tabIndex={0}
        role="region"
        aria-label={`Recorded response for ${cleanRequest}`}
      >
        <code>{JSON.stringify(match.body, null, 2)}</code>
      </pre>
    </div>
  );
}
