import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { RefundsService } from './refunds.service';
import { CreateWaveRefundDto } from './dto/create-refund.dto';
import { RefundResponseDto } from './dto/refund-response.dto';

@ApiTags('Remboursements')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('refund')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post('wave')
  @ApiOperation({
    summary: 'Lancer un remboursement Wave',
    description:
      "Crée un remboursement via la fonction edge Wave. La forme de la réponse suit le JSON du fournisseur.",
  })
  @ApiResponse({
    status: 201,
    description: "Résultat du remboursement (corps JSON de la fonction edge)",
    type: RefundResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Entrée invalide' })
  @ApiResponse({
    status: 500,
    description: 'Échec du traitement du remboursement',
  })
  async createWaveRefund(@Body() createRefundDto: CreateWaveRefundDto) {
    return this.refundsService.createWaveRefund(createRefundDto);
  }
}
