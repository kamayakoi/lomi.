import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';
import { PayoutsService } from './payouts.service';
import { CreateWavePayoutDto } from './dto/create-payout.dto';
import { CreateSpiPayoutDto } from './dto/create-spi-payout.dto';
import { PayoutResponseDto } from './dto/payout-response.dto';

@ApiTags('Virements sortants')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('payout')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post('wave')
  @ApiOperation({
    summary: 'Lancer un virement Wave',
    description:
      'Crée un virement via la fonction edge Wave. La forme de la réponse suit le JSON du fournisseur.',
  })
  @ApiResponse({
    status: 201,
    description: 'Virement initié (corps JSON de la fonction edge Wave)',
    type: PayoutResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Entrée invalide ou erreur fournisseur',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  async createWavePayout(
    @Body() createPayoutDto: CreateWavePayoutDto,
    @CurrentUser() user: AuthContext,
  ) {
    createPayoutDto.organizationId = user.organizationId;
    createPayoutDto.merchantId = user.merchantId;
    return this.payoutsService.createWavePayout(createPayoutDto);
  }

  @Post('spi')
  @ApiOperation({
    summary: 'Lancer un virement SPI',
    description:
      'Initie un virement instantané SPI (RPC initiate_spi_payout). Le règlement PI-SPI se poursuit de façon asynchrone.',
  })
  @ApiResponse({
    status: 201,
    description: 'Virement SPI initié',
    schema: { type: 'object', additionalProperties: true },
  })
  async createSpiPayout(
    @Body() createPayoutDto: CreateSpiPayoutDto,
    @CurrentUser() user: AuthContext,
  ) {
    createPayoutDto.organizationId = user.organizationId;
    createPayoutDto.merchantId = user.merchantId;
    return this.payoutsService.createSpiPayout(createPayoutDto);
  }
}
