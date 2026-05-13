import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreateBeneficiaryPayoutDto } from './dto/create-beneficiary-payout.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';
import {
  CurrencyCode,
  ProviderCode,
  PaymentMethodCode,
  PayoutStatus,
} from '../../utils/types/api';

@Injectable()
export class BeneficiaryPayoutsService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Initiate a beneficiary payout (pay contractor, supplier, etc.)
   * Uses RPC: create_beneficiary_payout
   * Returns immediately with pending status - completion confirmed via webhook
   */
  async create(createDto: CreateBeneficiaryPayoutDto, user: AuthContext) {
    const { data, error } = await this.supabase.rpc(
      'create_beneficiary_payout',
      {
        p_merchant_id: user.merchantId,
        p_amount: createDto.amount,
        p_currency_code: createDto.currency_code as CurrencyCode,
        p_payout_method_id: createDto.payout_method_id || null,
        p_provider_code: createDto.provider_code as ProviderCode,
        p_payment_method_code:
          createDto.payment_method_code as PaymentMethodCode,
        p_metadata: createDto.metadata || {},
        p_status: 'pending' as PayoutStatus,
      },
    );

    if (error) {
      throw new BadRequestException(
        error.message || 'Failed to create beneficiary payout',
      );
    }

    if (!data || data.length === 0) {
      throw new BadRequestException(
        'Failed to create beneficiary payout: No data returned',
      );
    }

    const result = data[0];

    // Check if payout_id is null (indicates an error from the RPC, e.g., insufficient balance)
    if (!result.payout_id) {
      throw new BadRequestException(
        result.message ||
          'Failed to create beneficiary payout: payout_id is null',
      );
    }

    // Return the initiated beneficiary payout details
    return this.findOne(result.payout_id, user);
  }

  /**
   * List all beneficiary payouts with filtering
   * Uses RPC: fetch_beneficiary_payouts
   */
  async findAll(
    user: AuthContext,
    statuses?: string[],
    startDate?: string,
    endDate?: string,
    currencyCode?: string,
    limit: number = 50,
    offset: number = 0,
  ) {
    const pageNumber = Math.floor(offset / limit) + 1;
    const pageSize = limit;

    const { data, error } = await this.supabase.rpc(
      'fetch_beneficiary_payouts',
      {
        p_merchant_id: user.merchantId,
        p_statuses: statuses || null,
        p_page_number: pageNumber,
        p_page_size: pageSize,
        p_start_date: startDate || null,
        p_end_date: endDate || null,
        p_currency_code: currencyCode as CurrencyCode,
      },
    );

    if (error) throw new Error(error.message);

    return {
      data: data || [],
      limit: pageSize,
      offset,
    };
  }

  /**
   * Get single beneficiary payout by ID
   */
  async findOne(id: string, user: AuthContext) {
    // Validate ID is not null or undefined
    if (!id) {
      throw new NotFoundException('Beneficiary payout ID is required');
    }

    const { data, error } = await this.supabase.getClient().rpc(
      'get_beneficiary_payout_api' as any,
      {
        p_payout_id: id,
        p_organization_id: user.organizationId,
      } as any,
    );

    const dataArray = Array.isArray(data) ? data : [data];
    const payout = dataArray[0];

    if (error || !payout) {
      throw new NotFoundException(
        `Beneficiary payout with ID ${id} not found or access denied`,
      );
    }

    return payout;
  }
}
