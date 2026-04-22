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

@ApiTags('Webhook Delivery Logs')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('webhook-delivery-logs')
export class WebhookDeliveryLogsController {
  constructor(
    private readonly webhookDeliveryLogsService: WebhookDeliveryLogsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List webhook delivery logs',
    description:
      'Returns delivery logs for a specific webhook. Logs are automatically created when webhooks are delivered. Use webhookId query parameter to filter by webhook.',
  })
  @ApiQuery({
    name: 'webhookId',
    required: true,
    description: 'Filter by webhook ID',
    type: String,
  })
  @ApiQuery({
    name: 'successOnly',
    required: false,
    description: 'Show only successful deliveries',
    type: Boolean,
    example: false,
  })
  @ApiQuery({
    name: 'failedOnly',
    required: false,
    description: 'Show only failed deliveries',
    type: Boolean,
    example: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of logs to return',
    type: Number,
    example: 25,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of logs to skip (for pagination)',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'List of webhook delivery logs',
    type: WebhookDeliveryLogResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
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
    summary: 'Get webhook delivery log by ID',
    description:
      'Returns detailed information about a specific webhook delivery log. Only accessible if the log belongs to your organization.',
  })
  @ApiParam({
    name: 'id',
    description: 'Log UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook delivery log details',
    type: WebhookDeliveryLogResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Webhook delivery log not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.webhookDeliveryLogsService.findOne(id, user);
  }
}
