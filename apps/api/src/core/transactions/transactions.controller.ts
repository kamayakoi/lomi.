import {
  Controller,
  Get,
  Param,
  Query,
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
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Transactions')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all transactions',
    description:
      "Returns all transactions for the authenticated merchant's organization with advanced filtering options. Transactions are created by the system when payments are processed.",
  })
  @ApiQuery({
    name: 'provider',
    required: false,
    description: 'Filter by payment provider code',
    type: String,
    example: 'WAVE',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by transaction status (comma-separated for multiple)',
    type: String,
    example: 'completed,pending',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by transaction type (comma-separated for multiple)',
    type: String,
    example: 'payment,refund',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    description: 'Filter by currency code (comma-separated for multiple)',
    type: String,
    example: 'XOF,USD',
  })
  @ApiQuery({
    name: 'paymentMethod',
    required: false,
    description: 'Filter by payment method code (comma-separated for multiple)',
    type: String,
    example: 'MOBILE_MONEY,CARDS',
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
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter transactions from this date (ISO 8601 format)',
    type: String,
    example: '2024-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter transactions up to this date (ISO 8601 format)',
    type: String,
    example: '2024-12-31T23:59:59Z',
  })
  @ApiQuery({
    name: 'isPos',
    required: false,
    description: 'Filter by POS transactions only',
    type: Boolean,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: TransactionResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('provider') provider?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('currency') currency?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('pageSize', new DefaultValuePipe(50), ParseIntPipe)
    pageSize?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('isPos') isPos?: boolean,
  ) {
    // Parse comma-separated values into arrays
    const statusArray = status ? status.split(',') : undefined;
    const typeArray = type ? type.split(',') : undefined;
    const currencyArray = currency ? currency.split(',') : undefined;
    const paymentMethodArray = paymentMethod
      ? paymentMethod.split(',')
      : undefined;

    return this.transactionsService.findAll(
      user,
      provider,
      statusArray,
      typeArray,
      currencyArray,
      paymentMethodArray,
      page,
      pageSize,
      startDate,
      endDate,
      isPos,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction by ID',
    description:
      'Returns a single transaction. Responds with 404 if the transaction does not exist or is not available for this API key.',
  })
  @ApiParam({
    name: 'id',
    description: 'Transaction UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction details',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.transactionsService.findOne(id, user);
  }
}
