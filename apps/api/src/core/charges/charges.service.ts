import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreateWaveChargeDto } from './dto/create-charge.dto';
import { CreateMtnChargeDto } from './dto/create-mtn-charge.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { environmentFromAuth } from '../common/auth-environment';
import { getMtnCountryConfig } from './mtn-country';
import { randomUUID } from 'crypto';

@Injectable()
export class ChargesService {
  private readonly logger = new Logger(ChargesService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async createWaveCharge(
    createChargeDto: CreateWaveChargeDto,
    user: AuthContext,
  ) {
    const {
      amount,
      currency,
      organizationId,
      merchantId,
      customer,
      description,
      successUrl,
      errorUrl,
    } = createChargeDto;
    const paymentEnvironment = environmentFromAuth(user);

    try {
      this.logger.log(
        `Initiating Wave charge for organization ${organizationId}`,
      );

      // 1. Get or Create Customer (RPC)
      const { data: custId, error: custError } = await this.supabaseService.rpc(
        'create_or_update_customer' as any,
        {
          p_merchant_id: merchantId,
          p_organization_id: organizationId,
          p_name: customer.name,
          p_email: customer.email,
          p_phone_number: customer.phoneNumber,
          p_city: null,
          p_address: null,
          p_country: 'CI',
          p_postal_code: null,
          p_whatsapp_number: null,
        },
      );

      if (custError || !custId) {
        this.logger.error(
          `Failed to create/update customer: ${custError?.message}`,
        );
        throw new InternalServerErrorException(
          'Failed to process customer details',
        );
      }

      const customerId = custId as string;

      // 2. Fetch Wave Aggregated Merchant ID from organization settings using RPC
      const { data: providerSettings, error: providerError } =
        await this.supabaseService.rpc('fetch_wave_provider_settings' as any, {
          p_organization_id: organizationId,
        });

      // The RPC returns an array of rows
      const waveSettings = providerSettings && providerSettings[0];

      if (providerError || !waveSettings?.provider_merchant_id) {
        this.logger.error(
          `Wave provider not configured: ${providerError?.message}`,
        );
        throw new BadRequestException(
          'Wave provider not configured for this organization (missing Aggregated Merchant ID)',
        );
      }

      this.logger.log(
        `Initiating Wave charge for organization ${organizationId} with Aggregated Merchant ID ${waveSettings.provider_merchant_id}`,
      );

      // Prepare URLs
      const frontendUrl =
        this.configService.get('FRONTEND_URL') || 'https://lomi.africa';
      const finalSuccessUrl = successUrl || `${frontendUrl}/checkout/success`;
      const finalErrorUrl = errorUrl || `${frontendUrl}/checkout/error`;
      const clientReference = randomUUID();

      // 3. Invoke Edge Function with simplified payload
      const { data: edgeResponse, error: edgeError } =
        await this.supabaseService.getClient().functions.invoke('wave', {
          body: {
            path: '/create-checkout-session',
            method: 'POST',
            body: {
              merchantId,
              organizationId,
              customerId,
              amount,
              currency,
              successUrl: finalSuccessUrl,
              errorUrl: finalErrorUrl,
              description,
              clientReference,
              metadata: {
                source: 'api_direct_charge',
              },
              paymentEnvironment,
            },
          },
        });

      if (edgeError) {
        this.logger.error(
          `Edge Function invocation failed: ${edgeError.message}`,
        );
        throw new InternalServerErrorException(
          `Payment processing failed: ${edgeError.message}`,
        );
      }

      if (edgeResponse?.error) {
        this.logger.error(
          `Wave Edge Function returned error: ${edgeResponse.error}`,
        );
        throw new BadRequestException(edgeResponse.error);
      }

      return edgeResponse;
    } catch (error) {
      this.logger.error(`Wave charge failed: ${error.message}`);
      throw error;
    }
  }

  async createMtnCharge(
    createChargeDto: CreateMtnChargeDto,
    user: AuthContext,
  ) {
    const {
      amount,
      currency,
      organizationId,
      merchantId,
      customer,
      description,
      countryCode,
      productId,
      subscriptionId,
      quantity = 1,
    } = createChargeDto;
    const paymentEnvironment = environmentFromAuth(user);
    const mtnApiEnvironment =
      paymentEnvironment === 'test' ? 'development' : 'production';
    const { targetEnvironment } = getMtnCountryConfig(countryCode ?? 'CI');

    const { data: providers, error: providerError } = await this.supabaseService
      .getClient()
      .rpc(
        'fetch_organization_providers_settings_api' as never,
        {
          p_merchant_id: merchantId,
          p_organization_id: organizationId,
          p_provider_code: 'MTN',
        } as never,
      );

    const mtnProvider = Array.isArray(providers)
      ? (providers as { provider_code: string; is_connected: boolean }[]).find(
          (p) => p.provider_code === 'MTN',
        )
      : undefined;

    if (providerError || !mtnProvider?.is_connected) {
      throw new BadRequestException(
        'MTN provider is not connected for this organization',
      );
    }

    const { data: custId, error: custError } = await this.supabaseService.rpc(
      'create_or_update_customer' as never,
      {
        p_merchant_id: merchantId,
        p_organization_id: organizationId,
        p_name: customer.name,
        p_email: customer.email ?? '',
        p_phone_number: customer.phoneNumber,
        p_city: null,
        p_address: null,
        p_country: countryCode ?? 'CI',
        p_postal_code: null,
        p_whatsapp_number: null,
      } as never,
    );

    if (custError || !custId) {
      throw new InternalServerErrorException(
        'Failed to process customer details',
      );
    }

    const { data: txRows, error: txError } = await this.supabaseService
      .getClient()
      .rpc(
        'create_mtn_transaction' as never,
        {
          p_merchant_id: merchantId,
          p_organization_id: organizationId,
          p_customer_id: custId,
          p_amount: amount,
          p_currency_code: currency,
          p_product_id: productId ?? null,
          p_subscription_id: subscriptionId ?? null,
          p_description: description ?? 'API MTN charge',
          p_metadata: { source: 'api_direct_charge' },
          p_quantity: quantity,
          p_checkout_session_id: null,
          p_environment: paymentEnvironment,
        } as never,
      );

    const txRow = Array.isArray(txRows) ? txRows[0] : txRows;
    if (txError || !txRow) {
      this.logger.error(`create_mtn_transaction failed: ${txError?.message}`);
      throw new BadRequestException(
        txError?.message ?? 'Failed to create MTN transaction',
      );
    }

    const { transaction_id: transactionId, external_id: externalId } =
      txRow as { transaction_id: string; external_id: string };

    const totalAmount = amount * quantity;
    const requestBody = {
      amount: String(totalAmount),
      currency,
      externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: customer.phoneNumber.replace(/^\+/, ''),
      },
      payerMessage: description ?? 'Payment',
      payeeNote: `Payment from ${customer.name} via lomi.`,
    };

    const { data: mtnResponse, error: mtnError } = await this.supabaseService
      .getClient()
      .functions.invoke('mtn', {
        body: {
          path: '/collection/v1_0/requesttopay',
          method: 'POST',
          body: requestBody,
          environment: mtnApiEnvironment,
          targetEnvironment,
        },
      });

    if (mtnError) {
      throw new InternalServerErrorException(
        `MTN API error: ${mtnError.message}`,
      );
    }

    const referenceId =
      (mtnResponse as { referenceId?: string })?.referenceId ??
      (mtnResponse as { data?: { referenceId?: string } })?.data?.referenceId;

    if (referenceId) {
      await this.supabaseService.getClient().rpc(
        'update_mtn_provider_reference' as never,
        {
          p_transaction_id: transactionId,
          p_provider_reference_id: referenceId,
        } as never,
      );
    }

    return {
      success: true,
      data: {
        transaction_id: transactionId,
        external_id: externalId,
        reference_id: referenceId,
        status: (mtnResponse as { status?: string })?.status ?? 'PENDING',
        mtn_response: mtnResponse,
      },
    };
  }
}
