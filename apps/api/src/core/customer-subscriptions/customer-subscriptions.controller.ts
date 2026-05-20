import {
  Controller,
  Get,
  Patch,
  Delete,
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
  ApiSecurity,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CustomerSubscriptionsService } from './customer-subscriptions.service';
import { UpdateSubscriptionDto } from '../subscriptions/dto/update-subscription.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Customer subscriptions')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('customer-subscriptions')
export class CustomerSubscriptionsController {
  constructor(private readonly service: CustomerSubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'List customer subscriptions' })
  @ApiQuery({ name: 'customer_id', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('customer_id') customerId?: string,
    @Query('status') status?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.service.findAll(user, customerId, status, limit, offset);
  }

  @Get(':subscription_id')
  @ApiOperation({ summary: 'Get customer subscription' })
  @ApiParam({ name: 'subscription_id', description: 'Subscription UUID' })
  findOne(
    @Param('subscription_id') subscriptionId: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.findOne(subscriptionId, user);
  }

  @Patch(':subscription_id')
  @ApiOperation({ summary: 'Update customer subscription' })
  update(
    @Param('subscription_id') subscriptionId: string,
    @Body() updateDto: UpdateSubscriptionDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.update(subscriptionId, updateDto, user);
  }

  @Delete(':subscription_id')
  @ApiOperation({ summary: 'Cancel customer subscription' })
  remove(
    @Param('subscription_id') subscriptionId: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.remove(subscriptionId, user);
  }
}
