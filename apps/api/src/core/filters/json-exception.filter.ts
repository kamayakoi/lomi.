import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { throttleRetryAfterSeconds } from '../../config/http.constants';

type ErrorBody = {
  error: {
    code: string;
    message: string;
    details: unknown;
  };
  request_id: string;
};

function mapStatusToCode(status: number): string {
  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'bad_request';
    case HttpStatus.UNAUTHORIZED:
      return 'unauthorized';
    case HttpStatus.FORBIDDEN:
      return 'forbidden';
    case HttpStatus.NOT_FOUND:
      return 'not_found';
    case HttpStatus.CONFLICT:
      return 'conflict';
    case HttpStatus.TOO_MANY_REQUESTS:
      return 'rate_limit_exceeded';
    case HttpStatus.SERVICE_UNAVAILABLE:
      return 'service_unavailable';
    default:
      if (status >= 500) return 'internal_error';
      return 'error';
  }
}

function normalizeHttpResponse(
  status: number,
  response: string | object,
): { message: string; details: unknown; code: string } {
  if (typeof response === 'string') {
    return {
      code: mapStatusToCode(status),
      message: response,
      details: null,
    };
  }
  if (typeof response === 'object' && response !== null) {
    const r = response as Record<string, unknown>;
    if (Array.isArray(r.message)) {
      return {
        code: mapStatusToCode(status),
        message: 'Validation failed',
        details: r.message,
      };
    }
    if (typeof r.message === 'string') {
      return {
        code: mapStatusToCode(status),
        message: r.message,
        details: r.error ?? r.details ?? null,
      };
    }
  }
  return {
    code: mapStatusToCode(status),
    message: 'Request failed',
    details: response,
  };
}

@Catch()
export class GlobalJsonExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalJsonExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request & { id?: string }>();
    const requestId = req.id ?? randomUUID();

    if (exception instanceof ThrottlerException) {
      const retryAfter = throttleRetryAfterSeconds();
      res.setHeader('Retry-After', String(retryAfter));
      this.send(res, requestId, HttpStatus.TOO_MANY_REQUESTS, {
        error: {
          code: 'rate_limit_exceeded',
          message: 'Too many requests',
          details: { retry_after_seconds: retryAfter },
        },
        request_id: requestId,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const n = normalizeHttpResponse(status, body);
      this.send(res, requestId, status, {
        error: {
          code: n.code,
          message: n.message,
          details: n.details,
        },
        request_id: requestId,
      });
      return;
    }

    const err = exception as Error;
    this.logger.error(err?.message, err?.stack);
    this.send(res, requestId, HttpStatus.INTERNAL_SERVER_ERROR, {
      error: {
        code: 'internal_error',
        message: 'An unexpected error occurred',
        details: null,
      },
      request_id: requestId,
    });
  }

  private send(
    res: Response,
    requestId: string,
    status: number,
    body: ErrorBody,
  ): void {
    if (!res.headersSent) {
      res.setHeader('X-Request-Id', requestId);
      res.status(status).json(body);
    }
  }
}
