import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { BeneficiaryPayoutsService } from './beneficiary-payouts.service';
import { CreateBeneficiaryPayoutDto } from './dto/create-beneficiary-payout.dto';
import { BeneficiaryPayoutResponseDto } from './dto/beneficiary-payout-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Paiements vers bénéficiaires')
@ApiSecurity('api-key')
@ApiExtraModels(BeneficiaryPayoutResponseDto)
@UseGuards(ApiKeyGuard)
@Controller('beneficiary-payouts')
export class BeneficiaryPayoutsController {
  constructor(private readonly service: BeneficiaryPayoutsService) {}

  @Post()
  @ApiOperation({
    summary: 'Lancer un paiement vers un bénéficiaire',
    description:
      'Initie un paiement vers un bénéficiaire (prestataire, fournisseur, salarié, etc.). Réponse immédiate en statut en attente ; le traitement est asynchrone côté fournisseur (Wave, SPI). Les mises à jour arrivent via webhooks. Sert à payer des tiers depuis le solde du compte.',
  })
  @ApiResponse({
    status: 201,
    description: 'Paiement initié avec succès (statut en attente)',
    type: BeneficiaryPayoutResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Entrée invalide ou solde insuffisant',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  create(
    @Body() createDto: CreateBeneficiaryPayoutDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.create(createDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les paiements vers bénéficiaires',
    description:
      "Renvoie les paiements de l'organisation avec pagination et filtres optionnels (statuts, plage de dates, devise).",
  })
  @ApiQuery({
    name: 'statuses',
    required: false,
    description: 'Statuts (séparés par des virgules)',
    type: String,
    example: 'pending,completed,failed',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Date de début (ISO 8601)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Date de fin (ISO 8601)',
    type: String,
  })
  @ApiQuery({
    name: 'currencyCode',
    required: false,
    description: 'Code devise',
    type: String,
    example: 'XOF',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre maximal de résultats',
    type: Number,
    example: 50,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Décalage pour la pagination',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des paiements',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(BeneficiaryPayoutResponseDto) },
        },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('statuses') statuses?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('currencyCode') currencyCode?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    const statusArray = statuses ? statuses.split(',') : undefined;
    return this.service.findAll(
      user,
      statusArray,
      startDate,
      endDate,
      currencyCode,
      limit,
      offset,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir un paiement bénéficiaire par ID',
    description:
      'Renvoie le détail d’un paiement (statut actuel et informations fournisseur).',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du paiement',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Détails du paiement',
    type: BeneficiaryPayoutResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paiement introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
  }
}
