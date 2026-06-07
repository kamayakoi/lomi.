/** Max characters returned from a single tool call (Composer parity). */
export function mcpMaxResultChars(): number {
  const n = Number(process.env.LOMI_MCP_MAX_RESULT_CHARS ?? '100000');
  return Number.isFinite(n) && n > 0 ? Math.min(n, 500_000) : 100_000;
}

const TRUNCATION_FOOTER =
  '\n\n[truncated — use pagination or a narrower query]';

/**
 * Truncate tool output text when it exceeds the configured limit.
 */
export function truncateToolResultText(text: string): string {
  const max = mcpMaxResultChars();
  if (text.length <= max) return text;
  return `${text.slice(0, max)}${TRUNCATION_FOOTER}`;
}
