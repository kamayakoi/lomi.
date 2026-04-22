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

@ApiTags('Subscriptions')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all subscriptions',
    description:
      "Returns all subscriptions for the authenticated merchant's organization. Subscriptions are automatically created when customers make recurring payments.",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of items per page',
    type: Number,
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions',
    type: SubscriptionResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
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
    summary: 'Get subscriptions for a customer',
    description:
      'Returns all subscriptions for a specific customer. Only accessible if the customer belongs to your organization.',
  })
  @ApiParam({
    name: 'customerId',
    description: 'Customer UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List of customer subscriptions',
    type: SubscriptionResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findByCustomer(
    @Param('customerId') customerId: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.subscriptionsService.findByCustomer(customerId, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get subscription by ID',
    description:
      'Returns detailed information about a specific subscription. Only accessible if the subscription belongs to your organization.',
  })
  @ApiParam({
    name: 'id',
    description: 'Subscription UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription details',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.subscriptionsService.findOne(id, user);
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancel a subscription',
    description:
      'Cancels an active subscription. This is the ONLY modification allowed on subscriptions. Price, billing dates, and other fields are system-managed and cannot be changed.',
  })
  @ApiParam({
    name: 'id',
    description: 'Subscription UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
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
        summary: 'Cancel with reason',
        value: {
          cancellation_reason: 'Customer requested cancellation',
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
