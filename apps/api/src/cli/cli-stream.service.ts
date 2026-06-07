import { Injectable } from '@nestjs/common';
import { Observable, Subject, filter, map, merge, interval } from 'rxjs';
import type { MessageEvent } from '@nestjs/common';

export interface CliStreamEvent {
  type: 'connected' | 'webhook' | 'ping';
  organization_id?: string;
  webhook_secret?: string;
  event?: string;
  headers?: Record<string, string>;
  payload?: unknown;
  ts?: string;
}

@Injectable()
export class CliStreamService {
  private readonly stream = new Subject<{
    organizationId: string;
    event: CliStreamEvent;
  }>();

  events$(organizationId: string): Observable<MessageEvent> {
    const data = this.stream.asObservable().pipe(
      filter((e) => e.organizationId === organizationId),
      map((e) => ({ data: e.event }) as MessageEvent),
    );
    const pings = interval(15_000).pipe(
      map(
        () =>
          ({
            data: {
              type: 'ping',
              ts: new Date().toISOString(),
            } satisfies CliStreamEvent,
          }) as MessageEvent,
      ),
    );
    return merge(data, pings);
  }

  emit(organizationId: string, event: CliStreamEvent): void {
    this.stream.next({ organizationId, event });
  }
}
