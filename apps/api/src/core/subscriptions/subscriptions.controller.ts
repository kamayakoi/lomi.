import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
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
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CancelSubscriptionDto } from './dto/cancel-subscription.dto';
import { SubscriptionResponseDto } from './dto/subscription-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Abonnements')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les abonnements',
    description:
      "Renvoie tous les abonnements de l'organisation du marchand authentifié. Les abonnements sont créés automatiquement lorsque les clients effectuent des paiements récurrents.",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: "Nombre d'éléments par page",
    type: Number,
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des abonnements',
    type: SubscriptionResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(50), ParseIntPipe)
    pageSize?: number,
  ) {
    return this.subscriptionsService.findAll(user, page, pageSize);
  }

  @Get('customer/:customerId')
  @ApiOperation({
    summary: 'Abonnements d’un client',
    description:
      "Renvoie les abonnements d'un client. Réponse 404 si le client n'existe pas ou n'est pas accessible avec cette clé API.",
  })
  @ApiParam({
    name: 'customerId',
    description: 'UUID du client',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des abonnements du client',
    type: SubscriptionResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Client introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findByCustomer(
    @Param('customerId') customerId: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.subscriptionsService.findByCustomer(customerId, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir un abonnement par ID',
    description:
      "Renvoie un abonnement. Réponse 404 s'il n'existe pas ou n'est pas accessible avec cette clé API.",
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’abonnement',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Détails de l’abonnement',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Abonnement introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.subscriptionsService.findOne(id, user);
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Résilier un abonnement',
    description:
      "Résilie un abonnement actif. C'est la seule modification autorisée sur un abonnement. Prix, dates de facturation et autres champs sont gérés par le système.",
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de l’abonnement',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Abonnement résilié avec succès',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Abonnement introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cancellation_reason: { type: 'string' },
      },
    },
    examples: {
      withReason: {
        summary: 'Résiliation avec motif',
        value: {
          cancellation_reason: 'Demande du client',
        },
      },
    },
  })
  cancel(
    @Param('id') id: string,
    @Body() cancelDto: CancelSubscriptionDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.subscriptionsService.cancel(id, cancelDto, user);
  }
}
