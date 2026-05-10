import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { McpSessionRegistry } from '../src/session-registry.js';

function mockTransport() {
  return {
    close: vi.fn().mockResolvedValue(undefined),
    onclose: undefined as (() => void) | undefined,
  } as unknown as import('@modelcontextprotocol/sdk/server/streamableHttp.js').StreamableHTTPServerTransport;
}

describe('McpSessionRegistry', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: 0 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('prunes idle sessions past TTL', () => {
    const registry = new McpSessionRegistry(10, 60_000);
    const t1 = mockTransport();
    const t2 = mockTransport();
    registry.attachSession('s1', t1);
    registry.attachSession('s2', t2);
    expect(registry.size).toBe(2);

    vi.advanceTimersByTime(61_000);
    registry.prune();
    expect(t1.close).toHaveBeenCalled();
    expect(t2.close).toHaveBeenCalled();
    expect(registry.size).toBe(0);
  });

  it('canAcceptNewSession is false when at capacity', () => {
    const registry = new McpSessionRegistry(2, 60_000);
    registry.attachSession('a', mockTransport());
    registry.attachSession('b', mockTransport());
    expect(registry.canAcceptNewSession()).toBe(false);
  });

  it('touch updates activity and prevents prune', () => {
    const registry = new McpSessionRegistry(10, 60_000);
    const t = mockTransport();
    registry.attachSession('s1', t);
    vi.advanceTimersByTime(50_000);
    registry.touch('s1');
    vi.advanceTimersByTime(50_000);
    registry.prune();
    expect(t.close).not.toHaveBeenCalled();
    expect(registry.has('s1')).toBe(true);
  });
});
