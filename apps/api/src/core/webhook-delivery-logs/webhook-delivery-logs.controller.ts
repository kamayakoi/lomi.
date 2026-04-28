import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { WebhookDeliveryLogsService } from './webhook-delivery-logs.service';
import { WebhookDeliveryLogResponseDto } from './dto/webhook-delivery-log-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Journaux de livraison webhooks')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('webhook-delivery-logs')
export class WebhookDeliveryLogsController {
  constructor(
    private readonly webhookDeliveryLogsService: WebhookDeliveryLogsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les journaux de livraison',
    description:
      "Renvoie les journaux de livraison pour un webhook donné. Ils sont créés automatiquement lors des tentatives d'envoi. Filtrez avec le paramètre de requête webhookId.",
  })
  @ApiQuery({
    name: 'webhookId',
    required: true,
    description: 'Filtrer par identifiant de webhook',
    type: String,
  })
  @ApiQuery({
    name: 'successOnly',
    required: false,
    description: 'Uniquement les livraisons réussies',
    type: Boolean,
    example: false,
  })
  @ApiQuery({
    name: 'failedOnly',
    required: false,
    description: 'Uniquement les livraisons en échec',
    type: Boolean,
    example: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre maximal de journaux',
    type: Number,
    example: 25,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: "Nombre de journaux à ignorer (pagination)",
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des journaux de livraison',
    type: WebhookDeliveryLogResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('webhookId') webhookId: string,
    @Query('successOnly', new DefaultValuePipe(false), ParseBoolPipe)
    successOnly?: boolean,
    @Query('failedOnly', new DefaultValuePipe(false), ParseBoolPipe)
    failedOnly?: boolean,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.webhookDeliveryLogsService.findAll(
      user,
      webhookId,
      successOnly,
      failedOnly,
      limit,
      offset,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir un journal de livraison par ID',
    description:
      "Renvoie un journal. Réponse 404 s'il n'existe pas ou n'est pas accessible avec cette clé API.",
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du journal',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Détails du journal de livraison',
    type: WebhookDeliveryLogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Journal introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.webhookDeliveryLogsService.findOne(id, user);
  }
}
