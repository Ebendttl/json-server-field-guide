'use client';

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { createServer, classifyRequest, type EngineRequest } from './engine';
import {
  INITIAL_DATASETS,
  RECORDED_PRESETS,
  RECORDED_SIGNATURES,
  type RecordedPreset,
} from './recorded';

/**
 * Standard HTTP status phrases.
 * Requirement: Status word is always shown, never colour alone.
 */
const STATUS_PHRASES: Record<number, string> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  404: 'Not Found',
  500: 'Internal Server Error',
};

function highlightJson(code: string): string {
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escaped.replace(
    /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    (match, str, isKey, boolOrNull) => {
      if (str) {
        if (isKey) {
          return `<span class="fg-hl-key">${str}</span>:`;
        }
        return `<span class="fg-hl-string">${str}</span>`;
      }
      if (boolOrNull) {
        return `<span class="fg-hl-keyword">${match}</span>`;
      }
      return `<span class="fg-hl-number">${match}</span>`;
    }
  );
}

type PresetKey = 'posts' | 'tasks' | 'empty';

export function Console() {
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState<PresetKey>('posts');

  // Initial pristine datasets
  const getInitialDb = (k: PresetKey) => {
    if (k === 'posts') return JSON.parse(JSON.stringify(INITIAL_DATASETS.quickstart));
    if (k === 'tasks') return JSON.parse(JSON.stringify(INITIAL_DATASETS.tasks));
    return {};
  };

  const [dbState, setDbState] = useState<Record<string, any>>(() => getInitialDb('posts'));
  const [editorText, setEditorText] = useState<string>(() =>
    JSON.stringify(getInitialDb('posts'), null, 2)
  );
  const [dbEdited, setDbEdited] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Server instance tied to current valid db state
  const serverRef = useRef(createServer(getInitialDb('posts')));

  // Request controls
  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('/posts');
  const [requestBodyText, setRequestBodyText] = useState('{\n  "title": "New item"\n}');
  const [showBodyEditor, setShowBodyEditor] = useState(false);

  // Response state
  const [responseStatus, setResponseStatus] = useState<number>(200);
  const [responseBody, setResponseBody] = useState<any>(RECORDED_PRESETS[0].responseBody);
  const [isHonestyRecorded, setIsHonestyRecorded] = useState(true);
  const [outsideVerifiedReason, setOutsideVerifiedReason] = useState<string | null>(null);

  // Synchronized scrolling for mirrored editor
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update server instance when valid dbState changes
  useEffect(() => {
    serverRef.current = createServer(dbState);
  }, [dbState]);

  // Derived endpoint chips from parsed db
  const derivedEndpoints = React.useMemo(() => {
    const endpoints: Array<{ label: string; path: string; method: string }> = [];
    if (!dbState || typeof dbState !== 'object') return endpoints;

    for (const [key, value] of Object.entries(dbState)) {
      if (key === '$schema') continue;
      if (Array.isArray(value)) {
        endpoints.push({ label: `/${key}`, path: `/${key}`, method: 'GET' });
        endpoints.push({ label: `/${key}/:id`, path: `/${key}/1`, method: 'GET' });
      } else if (typeof value === 'object' && value !== null) {
        endpoints.push({ label: `/${key}`, path: `/${key}`, method: 'GET' });
      }
    }
    return endpoints;
  }, [dbState]);

  // Handle Preset selection
  const handleSelectPreset = (newPreset: PresetKey) => {
    const newDb = getInitialDb(newPreset);
    setPreset(newPreset);
    setDbState(newDb);
    setEditorText(JSON.stringify(newDb, null, 2));
    setDbEdited(false);
    setParseError(null);

    const defaultPath = newPreset === 'tasks' ? '/tasks' : '/posts';
    setMethod('GET');
    setPath(defaultPath);

    // Initial response preview
    if (newPreset === 'posts') {
      setResponseStatus(200);
      setResponseBody(RECORDED_PRESETS[0].responseBody);
      setIsHonestyRecorded(true);
      setOutsideVerifiedReason(null);
    } else if (newPreset === 'tasks') {
      // tasks-filter-sort[0] is GET /tasks -> 200
      const tasksPreset = RECORDED_PRESETS.find((p) => p.path === '/tasks') || RECORDED_PRESETS[5];
      setResponseStatus(200);
      setResponseBody(tasksPreset ? tasksPreset.responseBody : newDb.tasks || []);
      setIsHonestyRecorded(true);
      setOutsideVerifiedReason(null);
    } else {
      setResponseStatus(404);
      setResponseBody({ error: 'Not Found' });
      setIsHonestyRecorded(false);
      setOutsideVerifiedReason(null);
    }
  };

  // Reset current preset to original
  const handleReset = () => {
    handleSelectPreset(preset);
  };

  // Editor change handler
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setEditorText(val);
    setDbEdited(true);

    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === 'object' && parsed !== null) {
        setDbState(parsed);
        setParseError(null);
      } else {
        setParseError('Root of db.json must be a JSON object.');
      }
    } catch (err: any) {
      setParseError(err.message || 'Invalid JSON syntax');
    }
  };

  // Send request execution
  const executeRequest = useCallback(() => {
    let parsedBody: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        parsedBody = requestBodyText ? JSON.parse(requestBodyText) : {};
      } catch (e: any) {
        setResponseStatus(400);
        setResponseBody({ error: 'Malformed request JSON body', message: e.message });
        setIsHonestyRecorded(false);
        setOutsideVerifiedReason(null);
        return;
      }
    }

    const req: EngineRequest = {
      method,
      path: path.trim() || '/',
      body: parsedBody,
    };

    // 1. Check classification against 91 verified requests
    const classification = classifyRequest(req, dbState);
    if (!classification.verified) {
      setOutsideVerifiedReason(
        'Outside the 91 verified requests - run it with real json-server to be sure'
      );
    } else {
      setOutsideVerifiedReason(null);
    }

    // 2. Execute via Engine
    const res = serverRef.current.handle(req);
    setResponseStatus(res.status);
    setResponseBody(res.body);

    // 3. If mutating method, update dbState and editor text
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && res.status < 400) {
      const updatedState = serverRef.current.getState();
      setDbState(updatedState);
      setEditorText(JSON.stringify(updatedState, null, 2));
      setDbEdited(true);
    }

    // 4. Honesty check:
    // Show "recorded" ONLY when (method, path, body, preset) exactly match a fixture step AND the db has not been edited.
    let matchesFixture = false;
    if (!dbEdited && (preset === 'posts' || preset === 'tasks')) {
      const targetDataset = preset === 'posts' ? 'quickstart' : 'tasks';
      matchesFixture = RECORDED_SIGNATURES.some((sig) => {
        if (sig.dataset !== targetDataset) return false;
        if (sig.method !== req.method) return false;
        if (sig.path !== req.path) return false;

        if (sig.requestBody == null) {
          return parsedBody == null || Object.keys(parsedBody).length === 0;
        }
        return JSON.stringify(sig.requestBody) === JSON.stringify(parsedBody);
      });
    }

    setIsHonestyRecorded(matchesFixture);
  }, [method, path, requestBodyText, dbState, dbEdited, preset]);

  // Fallback for SSR and noscript to avoid hydration warnings
  if (!mounted) {
    return (
      <div className="fg-console-root" data-ui id="live-console">
        <noscript>
          <div className="fg-console-noscript-banner">
            JavaScript is disabled. The static recorded preview below demonstrates the verified behavior.
          </div>
        </noscript>
        <div className="fg-preview-panel" data-ui>
          <div className="fg-preview-pane">
            <div className="fg-pane-header">
              <div className="fg-pane-title">
                <span className="fg-dot" />
                <span>db.json (Seed Data)</span>
              </div>
              <span className="fg-badge-recorded">3 resources</span>
            </div>
            <pre className="fg-code-content">
              <code>{JSON.stringify(INITIAL_DATASETS.quickstart, null, 2)}</code>
            </pre>
          </div>
          <div className="fg-preview-pane fg-preview-pane-divider">
            <div className="fg-pane-header">
              <div className="fg-pane-title">
                <span className="fg-badge-method">GET</span>
                <code>/posts</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="fg-badge-status">200 OK</span>
                <span className="fg-badge-recorded">recorded</span>
              </div>
            </div>
            <pre className="fg-code-content">
              <code>{JSON.stringify(RECORDED_PRESETS[0].responseBody, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  const editorId = 'fg-db-editor';
  const methodId = 'fg-req-method';
  const pathId = 'fg-req-path';
  const bodyId = 'fg-req-body';

  const statusPhrase = STATUS_PHRASES[responseStatus] || '';
  const statusLabel = `${responseStatus} ${statusPhrase}`.trim();

  return (
    <div className="fg-console-root" data-ui id="live-console">
      {/* Console Top Toolbar: Presets & Controls */}
      <div className="fg-console-topbar">
        <div className="fg-console-presets" role="group" aria-label="Database presets">
          <span className="fg-console-label">Preset:</span>
          <button
            type="button"
            className={`fg-console-btn ${preset === 'posts' && !dbEdited ? 'fg-btn-active' : ''}`}
            onClick={() => handleSelectPreset('posts')}
            aria-pressed={preset === 'posts' && !dbEdited}
          >
            Posts
          </button>
          <button
            type="button"
            className={`fg-console-btn ${preset === 'tasks' && !dbEdited ? 'fg-btn-active' : ''}`}
            onClick={() => handleSelectPreset('tasks')}
            aria-pressed={preset === 'tasks' && !dbEdited}
          >
            Tasks
          </button>
          <button
            type="button"
            className={`fg-console-btn ${preset === 'empty' && !dbEdited ? 'fg-btn-active' : ''}`}
            onClick={() => handleSelectPreset('empty')}
            aria-pressed={preset === 'empty' && !dbEdited}
          >
            Empty
          </button>
          <button
            type="button"
            className="fg-console-btn fg-btn-reset"
            onClick={handleReset}
            title="Reset dataset to original recorded state"
          >
            Reset
          </button>
        </div>

        {/* Derived Endpoints scrollable row */}
        <div className="fg-console-chips-wrap">
          <span className="fg-console-label">Endpoints:</span>
          <div className="fg-console-chips" role="list" aria-label="Available endpoints">
            {derivedEndpoints.map((ep, idx) => (
              <button
                key={`${ep.path}-${idx}`}
                type="button"
                className="fg-console-chip"
                onClick={() => {
                  setPath(ep.path);
                  setMethod(ep.method);
                }}
                title={`Set request path to ${ep.path}`}
              >
                <code>{ep.label}</code>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Editor & Right Interactive Response */}
      <div className="fg-console-grid">
        {/* Left Side: db.json Editor with Mirrored Syntax Tinting */}
        <div className="fg-console-pane fg-console-editor-pane">
          <div className="fg-pane-header">
            <div className="fg-pane-title">
              <span className="fg-dot" />
              <label htmlFor={editorId} className="fg-header-title-text">
                db.json {dbEdited && <span className="fg-edited-tag">(modified)</span>}
              </label>
            </div>
            <span className="fg-badge-recorded">
              {Object.keys(dbState).filter((k) => k !== '$schema').length} resources
            </span>
          </div>

          {parseError && (
            <div className="fg-console-error" role="alert">
              Error: {parseError} (keeping last valid database)
            </div>
          )}

          <div className="fg-console-editor-wrap">
            <textarea
              id={editorId}
              ref={textareaRef}
              className="fg-console-textarea"
              value={editorText}
              onChange={handleEditorChange}
              onScroll={handleScroll}
              spellCheck={false}
              aria-label="Database JSON source editor"
            />
            <pre ref={preRef} className="fg-console-pre" aria-hidden="true">
              <code dangerouslySetInnerHTML={{ __html: highlightJson(editorText) }} />
            </pre>
          </div>
        </div>

        {/* Right Side: Request Line & Response Panel */}
        <div className="fg-console-pane fg-console-response-pane">
          {/* Request Input Bar */}
          <div className="fg-console-request-bar">
            <div className="fg-req-method-wrap">
              <label htmlFor={methodId} className="fg-sr-only">
                HTTP Method
              </label>
              <select
                id={methodId}
                className="fg-console-select"
                value={method}
                onChange={(e) => {
                  const m = e.target.value;
                  setMethod(m);
                  if (['POST', 'PUT', 'PATCH'].includes(m)) {
                    setShowBodyEditor(true);
                  }
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PATCH">PATCH</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>

            <div className="fg-req-path-wrap">
              <label htmlFor={pathId} className="fg-sr-only">
                Request Path and Query
              </label>
              <input
                id={pathId}
                type="text"
                className="fg-console-input"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    executeRequest();
                  }
                }}
                placeholder="/posts or /tasks?status=open"
                autoCapitalize="none"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <button
              type="button"
              className="fg-console-send-btn"
              onClick={executeRequest}
              aria-label="Send HTTP Request"
            >
              Send
            </button>
          </div>

          {/* Optional Request Body (for writes) */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="fg-console-body-section">
              <div className="fg-body-section-header">
                <button
                  type="button"
                  className="fg-toggle-body-btn"
                  onClick={() => setShowBodyEditor(!showBodyEditor)}
                  aria-expanded={showBodyEditor}
                >
                  {showBodyEditor ? 'Hide Request Body' : 'Edit Request Body'}
                </button>
              </div>
              {showBodyEditor && (
                <div className="fg-body-editor-wrap">
                  <label htmlFor={bodyId} className="fg-sr-only">
                    Request JSON Body
                  </label>
                  <textarea
                    id={bodyId}
                    className="fg-body-textarea"
                    value={requestBodyText}
                    onChange={(e) => setRequestBodyText(e.target.value)}
                    rows={4}
                    spellCheck={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* Response Header & Honesty Label */}
          <div className="fg-pane-header">
            <div className="fg-pane-title">
              <span
                className={`fg-badge-status ${
                  responseStatus >= 200 && responseStatus < 300
                    ? 'fg-status-success'
                    : responseStatus >= 400
                    ? 'fg-status-error'
                    : ''
                }`}
              >
                {statusLabel}
              </span>
            </div>

            <div className="fg-honesty-badge-wrap">
              {isHonestyRecorded ? (
                <span className="fg-badge-honesty fg-badge-recorded" title="Exact match from recorded beta.15 fixture">
                  recorded
                </span>
              ) : (
                <span className="fg-badge-honesty fg-badge-engine" title="Simulated via TypeScript query engine">
                  engine output
                </span>
              )}
            </div>
          </div>

          {/* Outside Verified Note */}
          {outsideVerifiedReason && (
            <div className="fg-outside-verified-banner" role="status">
              <span>Outside the 91 verified requests - run it with real json-server to be sure</span>
            </div>
          )}

          {/* Live Response Body */}
          <div className="fg-response-body-wrap" aria-live="polite" aria-atomic="true">
            <pre className="fg-code-content">
              <code>{JSON.stringify(responseBody, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
