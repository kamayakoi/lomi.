import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreateWavePayoutDto } from './dto/create-payout.dto';
import { CreateSpiPayoutDto } from './dto/create-spi-payout.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { environmentFromAuth } from '../common/auth-environment';
import { randomUUID } from 'crypto';

@Injectable()
export class PayoutsService {
  private readonly logger = new Logger(PayoutsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createWavePayout(createPayoutDto: CreateWavePayoutDto) {
    const {
      amount,
      currency,
      beneficiary,
      reason,
      organizationId,
      merchantId,
    } = createPayoutDto;

    // 1. Fetch Wave Provider Settings to get Aggregated Merchant ID
    const { data: providerSettings, error: providerError } =
      await this.supabaseService.rpc('fetch_wave_provider_settings', {
        p_organization_id: organizationId as string,
      });

    const waveSettings = providerSettings && (providerSettings as any)[0];

    if (providerError || !waveSettings?.provider_merchant_id) {
      this.logger.error(
        `Wave provider not configured for payout: ${providerError?.message}`,
      );
      throw new BadRequestException(
        'Wave provider settings not found or missing Aggregated Merchant ID',
      );
    }

    const aggregatedMerchantId = waveSettings.provider_merchant_id;
    this.logger.log(
      `Initiating Wave payout for org ${organizationId} via ${aggregatedMerchantId}`,
    );

    // 2. Prepare Payload for Edge Function
    const payload = {
      path: '/payout',
      method: 'POST',
      body: {
        amount: String(amount),
        currency,
        beneficiary,
        reason: reason || 'Payout',
        aggregatedMerchantId,
        clientReference: randomUUID(),
        merchantId,
        organizationId,
      },
    };

    // 3. Call Edge Function
    const projectRef = this.configService.get<string>('SUPABASE_PROJECT_REF');
    const anonKey = this.configService.get<string>('SUPABASE_PUBLISHABLE_KEY');
    const edgeFunctionUrl = `https://${projectRef}.supabase.co/functions/v1/wave`;

    try {
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${anonKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Wave Payout Edge Function failed: ${errorText}`);
        throw new BadRequestException(`Payout failed: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Error processing payout: ${error.message}`);
      // If it's already a Nest exception, rethrow it
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Payout processing failed');
    }
  }

  async findAll(
    user: AuthContext,
    statuses?: string[],
    page = 1,
    pageSize = 50,
    startDate?: string,
    endDate?: string,
  ) {
    const paymentEnvironment = environmentFromAuth(user);
    const { data, error } = await this.supabaseService.rpc(
      'fetch_payouts' as never,
      {
        p_merchant_id: user.merchantId,
        p_statuses: statuses?.length ? statuses : null,
        p_page_number: page,
        p_page_size: pageSize,
        p_start_date: startDate ?? null,
        p_end_date: endDate ?? null,
        p_organization_id: user.organizationId,
        p_environment: paymentEnvironment,
      } as never,
    );

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { success: true, data: data ?? [] };
  }

  async createSpiPayout(dto: CreateSpiPayoutDto) {
    const { amount, currency, payoutMethodId, organizationId, merchantId } = dto;

    const { data: initiated, error: initError } = await this.supabaseService
      .getClient()
      .rpc('initiate_spi_payout' as never, {
        p_organization_id: organizationId,
        p_merchant_id: merchantId,
        p_payout_method_id: payoutMethodId,
        p_amount: amount,
        p_currency_code: currency,
      } as never);

    if (initError) {
      throw new BadRequestException(
        initError.message ?? 'Failed to initiate SPI payout',
      );
    }

    const row = Array.isArray(initiated) ? initiated[0] : initiated;
    if (!row) {
      throw new BadRequestException('Failed to initiate SPI payout');
    }

    const { payout_id: payoutId, spi_tx_id: spiTxId } = row as {
      payout_id: string;
      spi_tx_id: string;
      status: string;
      message: string;
    };

    const { error: updateError } = await this.supabaseService
      .getClient()
      .rpc('update_spi_payout_status' as never, {
        p_payout_id: payoutId,
        p_status: 'processing',
        p_spi_tx_id: spiTxId,
      } as never);

    if (updateError) {
      this.logger.warn(
        `update_spi_payout_status failed for ${payoutId}: ${updateError.message}`,
      );
    }

    return {
      success: true,
      data: {
        payout_id: payoutId,
        spi_tx_id: spiTxId,
        status: 'processing',
        message: 'SPI payout initiated; settlement continues asynchronously.',
      },
    };
  }
}
