import React from 'react';
import { VALID_FIXTURE_IDS } from './recorded';
import './fg.css';

interface VerifiedProps {
  fixture: string;
}

const VALID_SET = new Set(VALID_FIXTURE_IDS);

/**
 * Text badge linking to the tracked fixtures.json on GitHub.
 * Strict check: Throws build error if the fixture ID does not exist in the recorded fixtures.
 */
export function Verified({ fixture }: VerifiedProps) {
  const cleanId = fixture.trim();

  if (!VALID_SET.has(cleanId)) {
    throw new Error(
      `[Verified] Invalid fixture ID "${fixture}". Verified fixtures must match a valid scenario and step index in fixtures.json (e.g. "tasks-filter-sort#6").`
    );
  }

  const githubUrl = `https://github.com/Ebendttl/json-server-field-guide/blob/main/src/mdx/fg/fixtures.json`;

  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fg-verified-badge"
      title={`Inspect verified fixture ${cleanId} in fixtures.json on GitHub`}
    >
      <span className="fg-verified-dot" />
      <span>Verified: {cleanId}</span>
    </a>
  );
}
