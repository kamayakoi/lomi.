import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { PortalSessionContext } from './portal-session.guard';

export const PortalSession = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PortalSessionContext => {
    const req = ctx.switchToHttp().getRequest<{ portalSession: PortalSessionContext }>();
    return req.portalSession;
  },
);
