import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthContext {
  merchantId: string;
  organizationId: string;
  environment: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
