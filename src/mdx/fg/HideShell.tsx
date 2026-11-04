'use client';

import { useEffect } from 'react';

/**
 * HideShell isolates framework-specific selectors required to render a full-width
 * landing page in Thally mode: custom.
 *
 * If any framework selector ceases to match in the DOM, a dev-only console.warn is logged.
 */
export function HideShell() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const frameworkSelectors = [
        '.thally-docs-sidebar',
        '.thally-docs-shell',
        '.thally-docs-main',
      ];

      for (const selector of frameworkSelectors) {
        if (!document.querySelector(selector)) {
          console.warn(
            `[HideShell] Expected framework selector "${selector}" did not match any element in the DOM.`
          );
        }
      }
    }
  }, []);

  return (
    <style>{`
      /* Hide the framework docs sidebar on this route */
      .thally-docs-sidebar {
        display: none !important;
      }
      /* Remove side margin / offset from the shell container */
      .thally-docs-shell {
        max-width: 100% !important;
        width: 100% !important;
      }
      /* Expand the main content wrapper to full width */
      .thally-docs-main {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      /* Expand inner PageContainer */
      .thally-docs-main > div {
        max-width: 100% !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    `}</style>
  );
}
