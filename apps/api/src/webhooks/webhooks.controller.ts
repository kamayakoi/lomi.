import { Controller, UseGuards, Get, Param, Patch, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiBody,
} from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
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

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un webhook par ID' })
  @ApiResponse({
    status: 200,
    description: 'Le webhook',
    type: WebhookResponseDto,
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
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
        authorized_events: { type: 'string' },
        spi_event_types: { type: 'string' },
        supports_spi: { type: 'boolean' },
        verification_token: { type: 'string' },
        metadata: { type: 'object', additionalProperties: true },
      },
    },
    examples: {
      rotateUrl: {
        summary: "Mettre à jour l'URL de livraison",
        value: {
          url: 'https://example.com/webhooks/lomi',
          is_active: true,
        },
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
}
