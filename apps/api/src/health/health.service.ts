import { Injectable, Logger, OnModuleDestroy, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

export type ReadinessCheck = {
  name: string;
  ok: boolean;
  detail?: string;
};

export type RedisHealthResult =
  | {
      status: 'ok';
      redis: 'connected';
      queues?: {
        webhooks: Record<string, number>;
        metering: Record<string, number>;
        billing: Record<string, number>;
      };
    }
  | {
      status: 'degraded';
      redis: 'unavailable';
      error: string;
    };

@Injectable()
export class HealthService implements OnModuleDestroy {
  private readonly logger = new Logger(HealthService.name);
  private redis: Redis | null = null;

  constructor(
    @Optional() @InjectQueue('webhooks') private readonly webhooksQueue?: Queue,
    @Optional() @InjectQueue('metering') private readonly meteringQueue?: Queue,
    @Optional() @InjectQueue('billing') private readonly billingQueue?: Queue,
  ) {}

  private getRedis(): Redis | null {
    if (this.redis) {
      return this.redis;
    }

    const redisUrl = process.env.UPSTASH_REDIS_URL;
    try {
      if (redisUrl) {
        const url = new URL(redisUrl);
        this.redis = new Redis({
          host: url.hostname,
          port: parseInt(url.port || '6379', 10),
          password: decodeURIComponent(url.password),
          maxRetriesPerRequest: 1,
          connectTimeout: 5000,
          tls: url.protocol === 'rediss:' ? {} : undefined,
          lazyConnect: true,
        });
      } else {
        this.redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          maxRetriesPerRequest: 1,
          connectTimeout: 5000,
          lazyConnect: true,
        });
      }
      return this.redis;
    } catch (error) {
      this.logger.warn(`Redis client init failed: ${error}`);
      return null;
    }
  }

  private runEnvCheck(
    checks: ReadinessCheck[],
    name: string,
    fn: () => void,
  ): void {
    try {
      fn();
      checks.push({ name, ok: true });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      checks.push({ name, ok: false, detail });
    }
  }

  async checkReadiness(): Promise<{
    ok: boolean;
    ready: boolean;
    service: string;
    checks: ReadinessCheck[];
    redis?: RedisHealthResult;
  }> {
    const checks: ReadinessCheck[] = [];
    const isProduction = process.env.NODE_ENV === 'production';

    this.runEnvCheck(checks, 'supabase_url', () => {
      if (!process.env.SUPABASE_URL?.trim()) {
        throw new Error('SUPABASE_URL is required');
      }
    });

    this.runEnvCheck(checks, 'supabase_secret_key', () => {
      if (!process.env.SUPABASE_SECRET_KEY?.trim()) {
        throw new Error('SUPABASE_SECRET_KEY is required');
      }
    });

    this.runEnvCheck(checks, 'upstash_redis_url', () => {
      if (isProduction && !process.env.UPSTASH_REDIS_URL?.trim()) {
        throw new Error(
          'UPSTASH_REDIS_URL is required in production for BullMQ workers',
        );
      }
    });

    if (isProduction) {
      this.runEnvCheck(checks, 'cron_secret', () => {
        if (!process.env.CRON_SECRET?.trim()) {
          throw new Error('CRON_SECRET is required in production');
        }
      });
    }

    const redisResult = await this.checkRedis();
    checks.push({
      name: 'redis_ping',
      ok: redisResult.ok,
      detail: redisResult.ok
        ? undefined
        : 'error' in redisResult
          ? redisResult.error
          : 'unavailable',
    });

    const envOk = checks.every((c) => c.ok);
    const ready = envOk && redisResult.ok;

    return {
      ok: ready,
      ready,
      service: 'lomi-api',
      checks,
      redis: redisResult.ok
        ? {
            status: 'ok',
            redis: 'connected',
            ...('queues' in redisResult && redisResult.queues
              ? { queues: redisResult.queues }
              : {}),
          }
        : redisResult,
    };
  }

  async checkRedis(): Promise<RedisHealthResult & { ok: boolean }> {
    const redis = this.getRedis();
    if (!redis) {
      return {
        ok: false,
        status: 'degraded',
        redis: 'unavailable',
        error: 'Redis client could not be initialized',
      };
    }

    try {
      if (redis.status !== 'ready') {
        await redis.connect();
      }
      const pong = await redis.ping();
      if (pong !== 'PONG') {
        return {
          ok: false,
          status: 'degraded',
          redis: 'unavailable',
          error: `Unexpected PING response: ${pong}`,
        };
      }

      const queues = await this.getQueueCounts();
      return {
        ok: true,
        status: 'ok',
        redis: 'connected',
        ...(queues ? { queues } : {}),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        status: 'degraded',
        redis: 'unavailable',
        error: message,
      };
    }
  }

  private async getQueueCounts(): Promise<{
    webhooks: Record<string, number>;
    metering: Record<string, number>;
    billing: Record<string, number>;
  } | null> {
    if (!this.webhooksQueue && !this.meteringQueue && !this.billingQueue) {
      return null;
    }

    const countTypes = [
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
    ] as const;

    const snapshot = async (queue?: Queue) => {
      if (!queue) {
        return {};
      }
      return queue.getJobCounts(...countTypes);
    };

    return {
      webhooks: await snapshot(this.webhooksQueue),
      metering: await snapshot(this.meteringQueue),
      billing: await snapshot(this.billingQueue),
    };
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit().catch(() => undefined);
      this.redis = null;
    }
  }
}
