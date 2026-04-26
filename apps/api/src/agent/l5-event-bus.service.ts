import { Injectable } from '@nestjs/common';
import { Observable, Subject, filter, map, merge, interval } from 'rxjs';
import type { MessageEvent } from '@nestjs/common';

@Injectable()
export class L5EventBusService {
  private readonly stream = new Subject<{
    organizationId: string;
    event: Record<string, unknown>;
  }>();

  /** Emits org-scoped events for SSE clients. Includes keepalive pings every 30s. */
  events$(organizationId: string): Observable<MessageEvent> {
    const data = this.stream.asObservable().pipe(
      filter((e) => e.organizationId === organizationId),
      map((e) => ({ data: e.event } as MessageEvent)),
    );
    const pings = interval(30_000).pipe(
      map(
        () =>
          ({
            data: { type: 'ping', ts: new Date().toISOString() },
          }) as MessageEvent,
      ),
    );
    return merge(data, pings);
  }

  emit(organizationId: string, event: Record<string, unknown>): void {
    this.stream.next({ organizationId, event });
  }
}
