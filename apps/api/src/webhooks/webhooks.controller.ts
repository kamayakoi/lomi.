import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { CreateWebhookBodyDto } from './dto/create-webhook-body.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhookResponseDto } from './dto/webhook-response.dto';
import { ApiKeyGuard } from '../core/common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../core/common/decorators/current-user.decorator';

@ApiTags('Webhooks')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly service: WebhooksService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un webhook' })
  @ApiResponse({ status: 201, description: 'Webhook créé' })
  create(
    @Body() createDto: CreateWebhookBodyDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.create(createDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les webhooks' })
  @ApiResponse({
    status: 200,
    description: 'Liste des webhooks',
    type: WebhookResponseDto,
    isArray: true,
  })
  findAll(@CurrentUser() user: AuthContext) {
    return this.service.findAll(user);
  }

  @Post(':id/test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envoyer un événement test au webhook' })
  @ApiParam({ name: 'id', description: 'Webhook UUID' })
  test(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.test(id, user);
  }

  @Post(':webhookId/logs/:logId/retry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Relancer une livraison webhook' })
  @ApiParam({ name: 'webhookId', description: 'Webhook UUID' })
  @ApiParam({ name: 'logId', description: 'Delivery log UUID' })
  retryDelivery(
    @Param('webhookId') webhookId: string,
    @Param('logId') logId: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.retryDelivery(webhookId, logId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un webhook par ID' })
  @ApiResponse({
    status: 200,
    description: 'Le webhook',
    type: WebhookResponseDto,
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOneForApi(id, user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un webhook' })
  @ApiResponse({
    status: 200,
    description: 'Webhook mis à jour avec succès',
    type: WebhookResponseDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', format: 'uri' },
        is_active: { type: 'boolean' },
        authorized_events: { type: 'array', items: { type: 'string' } },
        metadata: { type: 'object', additionalProperties: true },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateWebhookDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.update(id, updateDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un webhook' })
  @ApiParam({ name: 'id', description: 'Webhook UUID' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.remove(id, user);
  }
}
