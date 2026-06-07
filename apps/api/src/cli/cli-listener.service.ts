import {
  Injectable,
  Logger,
  OnModuleDestroy,
  ForbiddenException,
} from '@nestjs/common';
import Redis from 'ioredis';
import type { LomiPaymentEnvironment } from '../utils/payment-environment';

const LISTENER_KEY_PREFIX = 'cli:listening';
const LISTENER_TTL_SECONDS = 30;

@Injectable()
export class CliListenerService implements OnModuleDestroy {
  private readonly logger = new Logger(CliListenerService.name);
  private redis: Redis | null = null;

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
          port: parseInt(url.port || '6379'),
          password: decodeURIComponent(url.password),
          maxRetriesPerRequest: null,
          tls: url.protocol === 'rediss:' ? {} : undefined,
          lazyConnect: true,
        });
      } else {
        this.redis = new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          maxRetriesPerRequest: null,
          lazyConnect: true,
        });
      }
      return this.redis;
    } catch (error) {
      this.logger.warn(`Redis unavailable for CLI listener registry: ${error}`);
      return null;
    }
  }

  private key(organizationId: string): string {
    return `${LISTENER_KEY_PREFIX}:${organizationId}`;
  }

  assertListenAllowed(
    environment: LomiPaymentEnvironment,
    allowProduction = false,
  ): void {
    if (environment === 'test') {
      return;
    }
    if (
      allowProduction &&
      process.env.CLI_LISTEN_ALLOW_PRODUCTION === 'true'
    ) {
      return;
    }
    throw new ForbiddenException(
      'CLI listen is only available in sandbox/test. Pass allowProduction and set CLI_LISTEN_ALLOW_PRODUCTION=true on the API to enable production.',
    );
  }

  async markActive(organizationId: string): Promise<void> {
    const redis = this.getRedis();
    if (!redis) return;
    try {
      if (redis.status !== 'ready') {
        await redis.connect();
      }
      await redis.set(this.key(organizationId), '1', 'EX', LISTENER_TTL_SECONDS);
    } catch (error) {
      this.logger.warn(`Failed to mark CLI listener active: ${error}`);
    }
  }

  async markInactive(organizationId: string): Promise<void> {
    const redis = this.getRedis();
    if (!redis) return;
    try {
      if (redis.status !== 'ready') {
        await redis.connect();
      }
      await redis.del(this.key(organizationId));
    } catch (error) {
      this.logger.warn(`Failed to mark CLI listener inactive: ${error}`);
    }
  }

  async hasActiveListener(organizationId: string): Promise<boolean> {
    const redis = this.getRedis();
    if (!redis) return false;
    try {
      if (redis.status !== 'ready') {
        await redis.connect();
      }
      const exists = await redis.exists(this.key(organizationId));
      return exists > 0;
    } catch (error) {
      this.logger.warn(`Failed to check CLI listener: ${error}`);
      return false;
    }
  }

  async refreshTtl(organizationId: string): Promise<void> {
    await this.markActive(organizationId);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit().catch(() => undefined);
      this.redis = null;
    }
  }
}
