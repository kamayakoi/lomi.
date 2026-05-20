import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UpdateSubscriptionDto } from '../subscriptions/dto/update-subscription.dto';

@Injectable()
export class CustomerSubscriptionsService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async findAll(
    user: AuthContext,
    customerId?: string,
    status?: string,
    limit = 20,
    offset = 0,
  ) {
    const { data, error } = await this.supabase.getClient().rpc(
      'list_customer_subscriptions' as never,
      {
        p_merchant_id: user.merchantId,
        p_customer_id: customerId ?? null,
        p_status: status ?? null,
        p_limit: limit,
        p_offset: offset,
      } as never,
    );

    if (error) {
      throw new Error(error.message);
    }

    const rows = Array.isArray(data) ? data : [];
    return {
      success: true,
      data: rows,
      meta: { limit, offset, total_returned: rows.length },
    };
  }

  async findOne(subscriptionId: string, user: AuthContext) {
    const subscription = await this.subscriptionsService.findOne(
      subscriptionId,
      user,
    );
    return { success: true, data: subscription };
  }

  async update(
    subscriptionId: string,
    updateDto: UpdateSubscriptionDto,
    user: AuthContext,
  ) {
    const data = await this.subscriptionsService.update(
      subscriptionId,
      updateDto,
      user,
    );
    return { success: true, data };
  }

  async remove(subscriptionId: string, user: AuthContext) {
    const data = await this.subscriptionsService.cancel(
      subscriptionId,
      {},
      user,
    );
    return { success: true, data };
  }
}
