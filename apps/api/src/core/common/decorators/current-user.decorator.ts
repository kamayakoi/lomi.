import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { LomiPaymentEnvironment } from '../../../utils/payment-environment';

export interface AuthContext {
  merchantId: string;
  organizationId: string;
  environment: LomiPaymentEnvironment;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
