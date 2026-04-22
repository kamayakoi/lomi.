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
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaymentRequestsService } from './payment-requests.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { PaymentRequestResponseDto } from './dto/payment-request-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Payment Requests')
@ApiSecurity('api-key')
@ApiExtraModels(PaymentRequestResponseDto)
@UseGuards(ApiKeyGuard)
@Controller('payment-requests')
export class PaymentRequestsController {
  constructor(private readonly service: PaymentRequestsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment request',
    description:
      'Creates a payment request for a customer. Payment requests have an expiration date and can be tracked until completion or expiry.',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment request created successfully',
    type: PaymentRequestResponseDto,
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
    schema: {
      type: 'object',
      required: ['amount', 'currency_code', 'expiry_date'],
      properties: {
        amount: { type: 'number' },
        currency_code: {
          type: 'string',
          enum: ['XOF', 'USD', 'EUR'],
        },
        description: { type: 'string' },
        customer_id: { type: 'string', format: 'uuid' },
        expiry_date: { type: 'string', format: 'date-time' },
        payment_reference: { type: 'string' },
        metadata: { type: 'object', additionalProperties: true },
      },
    },
    examples: {
      default: {
        summary: 'Payment request with expiry',
        value: {
          amount: 25000,
          currency_code: 'XOF',
          description: 'Consulting fee — March',
          expiry_date: '2026-12-31T23:59:59.000Z',
          payment_reference: 'INV-2026-042',
        },
      },
    },
  })
  create(
    @Body() createDto: CreatePaymentRequestDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.create(createDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'List all payment requests',
    description:
      'Returns all payment requests for your organization with pagination and optional filtering by status and customer.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by payment status',
    enum: ['pending', 'completed', 'failed', 'expired'],
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    description: 'Filter by customer ID',
    type: String,
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
    description: 'List of payment requests with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(PaymentRequestResponseDto) },
        },
        total: { type: 'number' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('status') status?: string,
    @Query('customerId') customerId?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    return this.service.findAll(user, status, customerId, limit, offset);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a payment request by ID',
    description:
      'Returns detailed information about a specific payment request, including its current status and payment details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment request UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Payment request details',
    type: PaymentRequestResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment request not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
  }
}
