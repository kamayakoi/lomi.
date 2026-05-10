import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

export type SessionRegistryEntry = {
  transport: StreamableHTTPServerTransport;
  lastActivity: number;
};

/**
 * Bounded in-memory registry for streamable MCP HTTP sessions.
 */
export class McpSessionRegistry {
  private readonly sessions = new Map<string, SessionRegistryEntry>();

  constructor(
    private readonly maxSessions: number,
    private readonly ttlMs: number,
  ) {}

  get size(): number {
    return this.sessions.size;
  }

  /** Remove idle sessions past TTL; closes transports. */
  prune(now: number = Date.now()): void {
    for (const [id, entry] of this.sessions) {
      if (now - entry.lastActivity > this.ttlMs) {
        void entry.transport.close();
        this.sessions.delete(id);
      }
    }
  }

  touch(sessionId: string, now: number = Date.now()): void {
    const e = this.sessions.get(sessionId);
    if (e) e.lastActivity = now;
  }

  /**
   * After prune: true if a brand-new session may be created.
   */
  canAcceptNewSession(now: number = Date.now()): boolean {
    this.prune(now);
    return this.sessions.size < this.maxSessions;
  }

  has(sessionId: string): boolean {
    return this.sessions.has(sessionId);
  }

  get(sessionId: string): SessionRegistryEntry | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Attach transport after session id is assigned (onsessioninitialized).
   */
  attachSession(
    sessionId: string,
    transport: StreamableHTTPServerTransport,
  ): void {
    this.sessions.set(sessionId, {
      transport,
      lastActivity: Date.now(),
    });
    transport.onclose = () => {
      this.sessions.delete(sessionId);
    };
  }
}
