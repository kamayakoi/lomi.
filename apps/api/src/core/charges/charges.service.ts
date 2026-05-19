import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../utils/supabase/supabase.service';
import { CreateWaveChargeDto } from './dto/create-charge.dto';
import { AuthContext } from '../common/decorators/current-user.decorator';
import { environmentFromAuth } from '../common/auth-environment';
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
}
