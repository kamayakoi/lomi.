import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { ChargesService } from './charges.service';
import { CreateWaveChargeDto } from './dto/create-charge.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthContext } from '../common/decorators/current-user.decorator';

@ApiTags('Encaissements')
@ApiSecurity('api-key')
@Controller('charge')
@UseGuards(ApiKeyGuard)
export class ChargesController {
  constructor(private readonly chargesService: ChargesService) {}

  @Post('wave')
  @ApiOperation({ summary: 'Lancer un encaissement direct Wave' })
  @ApiResponse({
    status: 201,
    description:
      "Encaissement initié (corps JSON renvoyé par la fonction edge Wave)",
    schema: {
      type: 'object',
      additionalProperties: true,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Entrée invalide ou erreur API Wave',
  })
  async createWaveCharge(
    @Body() createChargeDto: CreateWaveChargeDto,
    @CurrentUser() user: AuthContext,
  ) {
    createChargeDto.organizationId = user.organizationId;
    createChargeDto.merchantId = user.merchantId;
    return this.chargesService.createWaveCharge(createChargeDto);
  }
}
