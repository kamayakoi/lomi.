import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { CreateRefundDto } from './dto/create-refund.dto';
import {
  calculateRefundProcessingFee,
  refundFeePercentageForBalanceRpc,
  type RefundFeeConfig,
} from './refund-fees';

type TransactionRow = {
  transaction_id: string;
  organization_id: string;
  customer_id: string | null;
  gross_amount: number;
  net_amount: number;
  fee_amount: number;
  currency_code: string;
  provider_code: string;
  payment_method_code: string;
  status: string;
};

@Injectable()
export class RefundsService {
  private readonly logger = new Logger(RefundsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async create(dto: CreateRefundDto, user: AuthContext) {
    const tx = await this.loadTransaction(dto.transaction_id, user.organizationId);
    this.assertRefundable(tx, dto.amount);

    const gross = Number(tx.gross_amount);
    const isFullRefund = this.resolveIsFullRefund(dto, gross);

    const feeConfig = await this.fetchRefundFeeConfig(
      user.organizationId,
      tx.currency_code,
    );
    const feeAmount = calculateRefundProcessingFee(
      feeConfig,
      dto.amount,
      isFullRefund,
    );
    const feePercentage = refundFeePercentageForBalanceRpc(
      feeConfig,
      dto.amount,
      isFullRefund,
    );

    if (tx.provider_code === 'STRIPE' && tx.payment_method_code === 'CARDS') {
      return this.createCardRefund(dto, user, feePercentage);
    }

    if (tx.provider_code === 'WAVE') {
      if (isFullRefund) {
        return this.createMobileMoneyFullRefund(
          dto,
          user,
          tx,
          feeAmount,
          feePercentage,
        );
      }
      return this.createMobileMoneyPartialRefund(
        dto,
        user,
        tx,
        feeAmount,
        feePercentage,
      );
    }

    throw new BadRequestException(
      'Refunds are not supported for this transaction type',
    );
  }

  async findAll(
    user: AuthContext,
    status?: string,
    startDate?: string,
    endDate?: string,
    limit = 50,
    offset = 0,
  ) {
    const { data, error } = await this.supabaseService.getClient().rpc(
      'list_refunds' as never,
      {
        p_organization_id: user.organizationId,
        p_status: status ?? null,
        p_start_date: startDate ?? null,
        p_end_date: endDate ?? null,
        p_limit: limit,
        p_offset: offset,
      } as never,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true, data: data ?? [] };
  }

  async findOne(refundId: string, user: AuthContext) {
    const { data, error } = await this.supabaseService.getClient().rpc(
      'get_refund' as never,
      {
        p_refund_id: refundId,
        p_organization_id: user.organizationId,
      } as never,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    const rows = Array.isArray(data) ? data : [];
    const row = rows[0];
    if (!row) {
      throw new NotFoundException(
        `Refund with ID ${refundId} not found or access denied`,
      );
    }

    return { success: true, data: row };
  }

  private resolveIsFullRefund(dto: CreateRefundDto, gross: number): boolean {
    if (dto.refund_type === 'full') return true;
    if (dto.refund_type === 'partial') return false;
    return dto.amount + 0.01 >= gross;
  }

  private async loadTransaction(
    transactionId: string,
    organizationId: string,
  ): Promise<TransactionRow> {
    const { data, error } = await this.supabaseService.getClient().rpc(
      'get_transaction' as never,
      {
        p_transaction_id: transactionId,
        p_organization_id: organizationId,
      } as never,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    const rows = Array.isArray(data) ? data : [];
    const tx = rows[0] as TransactionRow | undefined;
    if (!tx?.transaction_id) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found or access denied`,
      );
    }

    return tx;
  }

  private assertRefundable(tx: TransactionRow, amount: number) {
    if (tx.status !== 'completed') {
      throw new BadRequestException(
        'Only completed transactions can be refunded',
      );
    }
    if (amount <= 0) {
      throw new BadRequestException('Refund amount must be positive');
    }
    if (amount > Number(tx.gross_amount) + 0.01) {
      throw new BadRequestException(
        'Refund amount exceeds transaction gross amount',
      );
    }
  }

  private async fetchRefundFeeConfig(
    organizationId: string,
    currencyCode: string,
  ): Promise<RefundFeeConfig> {
    const client = this.supabaseService.getClient();
    const [fullResult, partialResult] = await Promise.all([
      client.rpc('get_effective_other_fee_config' as never, {
        p_organization_id: organizationId,
        p_currency_code: currencyCode,
        p_subcategory: 'refund',
      } as never),
      client.rpc('get_effective_other_fee_config' as never, {
        p_organization_id: organizationId,
        p_currency_code: currencyCode,
        p_subcategory: 'partial_refund',
      } as never),
    ]);

    const pick = (data: unknown) => {
      const row = Array.isArray(data) ? data[0] : data;
      return row as { percentage?: number; fixed_amount?: number } | undefined;
    };

    const fullData = pick(fullResult.data);
    const partialData = pick(partialResult.data);

    return {
      full: {
        percentage: fullData?.percentage ?? 0,
        fixed_amount: fullData?.fixed_amount ?? 0,
      },
      partial: {
        percentage: partialData?.percentage ?? 0,
        fixed_amount: partialData?.fixed_amount ?? 0,
      },
    };
  }

  private async createCardRefund(
    dto: CreateRefundDto,
    user: AuthContext,
    feePercentage: number,
  ) {
    const { data, error } = await this.supabaseService.getClient().rpc(
      'create_manual_refund_request_api' as never,
      {
        p_merchant_id: user.merchantId,
        p_organization_id: user.organizationId,
        p_transaction_id: dto.transaction_id,
        p_refund_amount: dto.amount,
        p_processing_fee_percentage: feePercentage,
        p_reason: dto.reason ?? null,
      } as never,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    const result = data as {
      success?: boolean;
      error?: string;
      refund_id?: string;
      refunded_amount?: number;
      status?: string;
    };

    if (!result?.success) {
      throw new BadRequestException(
        result?.error ?? 'Failed to create card refund',
      );
    }

    return {
      success: true,
      refund_id: result.refund_id,
      transaction_id: dto.transaction_id,
      refunded_amount: result.refunded_amount ?? dto.amount,
      status: result.status ?? 'completed',
      message:
        'Refund recorded. Customer credit is processed by our team.',
    };
  }

  private async createMobileMoneyFullRefund(
    dto: CreateRefundDto,
    user: AuthContext,
    tx: TransactionRow,
    feeAmount: number,
    feePercentage: number,
  ) {
    await this.invokePaymentEdge('/refund', {
      transactionId: dto.transaction_id,
      amount: String(dto.amount),
      currency: tx.currency_code,
      reason: dto.reason,
    });

    const refundId = await this.recordRefundAndBalance({
      transactionId: dto.transaction_id,
      amount: dto.amount,
      reason: dto.reason,
      providerCode: tx.provider_code,
      merchantId: user.merchantId,
      feeAmount,
      feePercentage,
      metadata: {
        processing_fee: feeAmount,
        net_refund_amount: dto.amount - feeAmount,
        refund_method: 'full_refund',
        source: 'api',
      },
    });

    return {
      success: true,
      refund_id: refundId,
      transaction_id: dto.transaction_id,
      refunded_amount: dto.amount,
      status: 'completed',
      message: 'Refund initiated and recorded.',
    };
  }

  private async createMobileMoneyPartialRefund(
    dto: CreateRefundDto,
    user: AuthContext,
    tx: TransactionRow,
    feeAmount: number,
    feePercentage: number,
  ) {
    if (!tx.customer_id) {
      throw new BadRequestException(
        'Transaction has no customer; partial refund requires a customer phone number',
      );
    }

    const customer = await this.loadCustomer(tx.customer_id, user.organizationId);
    const phone =
      customer.phone_number || customer.whatsapp_number;
    if (!phone) {
      throw new BadRequestException(
        'Customer phone number is required for partial refunds',
      );
    }

    const payoutResult = await this.invokePaymentEdge('/beneficiary-payout', {
      merchantId: user.merchantId,
      organizationId: user.organizationId,
      amount: dto.amount,
      currency: tx.currency_code,
      recipientName: customer.name || 'Customer',
      recipientPhone: phone,
      description:
        dto.reason ||
        `Partial refund for transaction ${dto.transaction_id}`,
      metadata: {
        is_partial_refund: true,
        partial_refund_for_transaction: dto.transaction_id,
        original_transaction_amount: tx.gross_amount,
        refund_type: 'partial',
        source: 'api',
      },
    }) as {
      payoutId?: string;
      wavePayoutId?: string;
    };

    const refundId = await this.recordRefundAndBalance({
      transactionId: dto.transaction_id,
      amount: dto.amount,
      reason: dto.reason
        ? `${dto.reason} (partial refund via payout)`
        : 'Partial refund via payout',
      providerCode: tx.provider_code,
      merchantId: user.merchantId,
      feeAmount,
      feePercentage,
      metadata: {
        processing_fee: feeAmount,
        net_refund_amount: dto.amount - feeAmount,
        refund_method: 'partial_beneficiary_payout',
        beneficiary_payout_id: payoutResult?.payoutId,
        payout_reference: payoutResult?.wavePayoutId,
        customer_phone: phone,
        is_partial_refund: true,
        source: 'api',
      },
    });

    return {
      success: true,
      refund_id: refundId,
      transaction_id: dto.transaction_id,
      refunded_amount: dto.amount,
      status: 'completed',
      message: 'Partial refund sent to customer and recorded.',
    };
  }

  private async loadCustomer(customerId: string, organizationId: string) {
    const { data, error } = await this.supabaseService.getClient().rpc(
      'get_customer' as never,
      {
        p_customer_id: customerId,
        p_organization_id: organizationId,
      } as never,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    const rows = Array.isArray(data) ? data : [];
    const customer = rows[0] as {
      name?: string;
      phone_number?: string;
      whatsapp_number?: string;
    };

    if (!customer) {
      throw new NotFoundException('Customer not found for this transaction');
    }

    return customer;
  }

  private async recordRefundAndBalance(params: {
    transactionId: string;
    amount: number;
    reason?: string;
    providerCode: string;
    merchantId: string;
    feeAmount: number;
    feePercentage: number;
    metadata: Record<string, unknown>;
  }): Promise<string> {
    const { data: refundId, error: createError } =
      await this.supabaseService.getClient().rpc('create_refund' as never, {
        p_transaction_id: params.transactionId,
        p_amount: params.amount,
        p_reason: params.reason ?? null,
        p_provider_transaction_id: null,
        p_provider_merchant_id: null,
        p_provider_code: params.providerCode,
        p_metadata: params.metadata,
        p_created_by: params.merchantId,
      } as never);

    if (createError || !refundId) {
      this.logger.error(`create_refund failed: ${createError?.message}`);
      throw new BadRequestException(
        createError?.message ?? 'Failed to record refund',
      );
    }

    const { data: balanceRows, error: balanceError } =
      await this.supabaseService.getClient().rpc(
        'update_organization_balance_for_refund' as never,
        {
          p_transaction_id: params.transactionId,
          p_refund_amount: params.amount,
          p_processing_fee_percentage: params.feePercentage,
        } as never,
      );

    if (balanceError) {
      throw new BadRequestException(balanceError.message);
    }

    const balanceResult = Array.isArray(balanceRows)
      ? balanceRows[0]
      : balanceRows;
    const success = (balanceResult as { success?: boolean })?.success;
    const errorMessage = (balanceResult as { error_message?: string })
      ?.error_message;

    if (success === false) {
      throw new BadRequestException(
        errorMessage ?? 'Insufficient balance for refund',
      );
    }

    return String(refundId);
  }

  private async invokePaymentEdge(
    path: string,
    body: Record<string, unknown>,
  ): Promise<unknown> {
    const projectRef = this.configService.get<string>('SUPABASE_PROJECT_REF');
    const anonKey = this.configService.get<string>('SUPABASE_PUBLISHABLE_KEY');

    if (!projectRef || !anonKey) {
      throw new InternalServerErrorException('Payment configuration missing');
    }

    const edgeFunctionUrl = `https://${projectRef}.supabase.co/functions/v1/wave`;

    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        path,
        method: 'POST',
        body,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Payment edge ${path} failed: ${errorText}`);
      throw new BadRequestException(`Refund processing failed: ${errorText}`);
    }

    return response.json();
  }
}
