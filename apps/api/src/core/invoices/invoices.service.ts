import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { CurrencyCode, Json } from '../../utils/types/api';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateInvoiceDto, user: AuthContext) {
    const lineItems = dto.line_items ?? [];
    const amount =
      dto.amount ??
      lineItems.reduce((sum, item) => {
        const quantity = Number(item.quantity ?? 1);
        const unit = Number(item.unit_price ?? item.price ?? 0);
        return sum + Number(item.amount ?? quantity * unit);
      }, 0);

    const { data, error } = await this.supabase.getClient().rpc(
      'create_invoice_receivable' as any,
      {
        p_organization_id: user.organizationId,
        p_customer_id: dto.customer_id,
        p_amount: amount,
        p_currency_code: (dto.currency_code ?? 'XOF') as CurrencyCode,
        p_due_date: dto.due_date ?? null,
        p_status: 'draft',
        p_description: dto.description ?? null,
        p_line_items: lineItems as unknown as Json,
        p_customer_details: (dto.customer_details ?? {}) as Json,
        p_payment_details: (dto.payment_details ?? {}) as Json,
        p_template: (dto.template ?? {}) as Json,
        p_invoice_number: dto.invoice_number ?? null,
        p_created_by: user.merchantId,
        p_environment: user.environment,
        p_origin: dto.origin ?? 'manual',
        p_product_id: dto.product_id ?? null,
        p_price_id: dto.price_id ?? null,
        p_subscription_id: dto.subscription_id ?? null,
        p_metadata: (dto.metadata ?? {}) as Json,
      } as any,
    );

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll(
    user: AuthContext,
    status?: string,
    customerId?: string,
    limit = 20,
    offset = 0,
    search?: string,
  ) {
    const { data, error } = await this.supabase.getClient().rpc(
      'list_customer_invoices_api' as any,
      {
        p_organization_id: user.organizationId,
        p_status: status && status !== 'all' ? status : null,
        p_customer_id: customerId ?? null,
        p_limit: limit,
        p_offset: offset,
        p_search: search ?? null,
        p_environment: user.environment,
      } as any,
    );

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async findOne(id: string, user: AuthContext) {
    const { data, error } = await this.supabase.getClient().rpc(
      'get_customer_invoice_api' as any,
      {
        p_invoice_id: id,
        p_organization_id: user.organizationId,
      } as any,
    );

    if (error || !data) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, dto: UpdateInvoiceDto, user: AuthContext) {
    const { data, error } = await this.supabase.getClient().rpc(
      'update_customer_invoice_api' as any,
      {
        p_invoice_id: id,
        p_organization_id: user.organizationId,
        p_update_data: dto as unknown as Json,
      } as any,
    );

    if (error || !data) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return data;
  }

  async createCheckoutSession(id: string, user: AuthContext) {
    const { data, error } = await this.supabase.getClient().rpc(
      'create_invoice_checkout_session' as any,
      {
        p_invoice_id: id,
        p_created_by: user.merchantId,
        p_expiration_minutes: 60 * 24 * 7,
      } as any,
    );

    if (error) throw new Error(error.message);
    return data;
  }
}
