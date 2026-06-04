import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { LomiPaymentEnvironment } from '../../../utils/payment-environment';

export interface AuthContext {
  apiKey?: string;
  merchantId: string;
  actorOrganizationId?: string;
  targetOrganizationId?: string;
  organizationId: string;
  environment: LomiPaymentEnvironment;
  isNetworkRequest?: boolean;
  lomiAccount?: string | null;
  networkAccountId?: string | null;
  networkMembershipId?: string | null;
  publicAccountId?: string | null;
  networkCapabilityKey?: string | null;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
