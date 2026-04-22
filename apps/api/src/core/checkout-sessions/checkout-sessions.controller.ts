import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
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
import { CheckoutSessionsService } from './checkout-sessions.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CheckoutSessionResponseDto } from './dto/checkout-session-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Checkout Sessions')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('checkout-sessions')
export class CheckoutSessionsController {
  constructor(private readonly service: CheckoutSessionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new checkout session',
    description:
      'Creates a hosted payment page for customers to complete their purchase. The checkout session expires after 60 minutes by default. Returns a session ID and URL to redirect your customer to.',
  })
  @ApiResponse({
    status: 201,
    description: 'Checkout session created successfully',
    type: CheckoutSessionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  @ApiBody({
    description:
      'Checkout session payload. Either set `amount` (+ optional product fields) or `line_items` for multi-product carts.',
    schema: {
      type: 'object',
      required: ['currency_code'],
      properties: {
        amount: { type: 'number', example: 10000 },
        currency_code: {
          type: 'string',
          enum: ['XOF', 'USD', 'EUR'],
          example: 'XOF',
        },
        title: { type: 'string' },
        description: { type: 'string' },
        customer_id: { type: 'string', format: 'uuid' },
        customer_email: { type: 'string', format: 'email' },
        customer_name: { type: 'string' },
        customer_phone: { type: 'string' },
        customer_city: { type: 'string' },
        customer_country: { type: 'string' },
        customer_address: { type: 'string' },
        customer_postal_code: { type: 'string' },
        product_id: { type: 'string', format: 'uuid' },
        price_id: { type: 'string', format: 'uuid' },
        subscription_id: { type: 'string', format: 'uuid' },
        allow_quantity: { type: 'boolean' },
        quantity: { type: 'number' },
        success_url: { type: 'string', format: 'uri' },
        cancel_url: { type: 'string', format: 'uri' },
        allow_coupon_code: { type: 'boolean' },
        require_billing_address: { type: 'boolean' },
        payment_link_id: { type: 'string', format: 'uuid' },
        metadata: { type: 'object', additionalProperties: true },
        line_items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['price_id'],
            properties: {
              price_id: { type: 'string', format: 'uuid' },
              quantity: { type: 'number' },
              metadata: { type: 'object', additionalProperties: true },
            },
          },
        },
      },
    },
    examples: {
      amount: {
        summary: 'Fixed amount checkout',
        value: {
          currency_code: 'XOF',
          amount: 10000,
          success_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
        },
      },
      lineItems: {
        summary: 'Multi-product (line items)',
        value: {
          currency_code: 'XOF',
          line_items: [
            { price_id: '123e4567-e89b-12d3-a456-426614174000', quantity: 2 },
          ],
          success_url: 'https://example.com/success',
        },
      },
    },
  })
  create(
    @Body() createDto: CreateCheckoutSessionDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.create(createDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'List all checkout sessions',
    description:
      'Returns all checkout sessions for your organization with pagination and optional status filtering.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by session status (matches checkout_session_status)',
    enum: ['open', 'completed', 'expired'],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results to return',
    type: Number,
    example: 20,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset for pagination',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'List of checkout sessions',
    type: CheckoutSessionResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('status') status?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.service.findAll(
      user,
      status as 'open' | 'completed' | 'expired',
      limit,
      offset,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a checkout session by ID',
    description:
      'Returns detailed information about a specific checkout session, including its current status and associated customer/product details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Checkout session UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Checkout session details',
    type: CheckoutSessionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Checkout session not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
  }
}
