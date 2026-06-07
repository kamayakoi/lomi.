import { describe, expect, it } from 'vitest';

import { truncateToolResultText } from '../src/truncate-result.ts';

describe('truncateToolResultText', () => {
  it('returns short text unchanged', () => {
    expect(truncateToolResultText('hello')).toBe('hello');
  });

  it('truncates long text with footer', () => {
    const original = process.env.LOMI_MCP_MAX_RESULT_CHARS;
    process.env.LOMI_MCP_MAX_RESULT_CHARS = '100';
    try {
      const out = truncateToolResultText('x'.repeat(200));
      expect(out.length).toBeLessThan(200);
      expect(out).toContain('[truncated');
    } finally {
      if (original === undefined) delete process.env.LOMI_MCP_MAX_RESULT_CHARS;
      else process.env.LOMI_MCP_MAX_RESULT_CHARS = original;
    }
  });
});
