import { Controller, UseGuards, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { AccountResponseDto } from './dto/account-response.dto';
import { AccountBalanceResponseDto } from './dto/account-balance-response.dto';
import { BalanceBreakdownResponseDto } from './dto/balance-breakdown-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';
import { type CurrencyCode } from '../../utils/types/api';

@ApiTags('Accounts')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'List all accounts' })
  @ApiResponse({
    status: 200,
    description: 'List of accounts',
    type: AccountResponseDto,
    isArray: true,
  })
  findAll(@CurrentUser() user: AuthContext) {
    return this.service.findAll(user);
  }

  @Get('balance')
  @ApiOperation({
    summary: 'Get account balance',
    description:
      'Fetch current account balance for all currencies or a specific currency',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    description: 'Filter by specific currency code (XOF, USD, EUR)',
    enum: ['XOF', 'USD', 'EUR'],
  })
  @ApiResponse({
    status: 200,
    description: 'Account balance information',
    type: AccountBalanceResponseDto,
    isArray: true,
  })
  getBalance(
    @CurrentUser() user: AuthContext,
    @Query('currency') currency?: CurrencyCode,
  ) {
    return this.service.getBalance(user, currency);
  }

  @Get('balance/breakdown')
  @ApiOperation({
    summary: 'Get detailed balance breakdown',
    description:
      'Fetch detailed balance breakdown including available, pending, and total balances. Optionally convert to a target currency.',
  })
  @ApiQuery({
    name: 'target_currency',
    required: false,
    description: 'Target currency for conversion (XOF, USD, EUR)',
    enum: ['XOF', 'USD', 'EUR'],
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed balance breakdown with conversion',
    type: BalanceBreakdownResponseDto,
    isArray: true,
  })
  getBalanceBreakdown(
    @CurrentUser() user: AuthContext,
    @Query('target_currency') targetCurrency?: CurrencyCode,
  ) {
    return this.service.getBalanceBreakdown(user, targetCurrency);
  }

  @Get('balance/check/:currency')
  @ApiOperation({
    summary: 'Check available balance',
    description:
      'Check if merchant has sufficient available balance in specified currency',
  })
  @ApiResponse({
    status: 200,
    description: 'Available balance check result',
    schema: {
      type: 'object',
      properties: {
        has_sufficient_balance: {
          type: 'boolean',
          description: 'Whether merchant has funds available',
        },
        available_balance: {
          type: 'number',
          description: 'Current available balance',
        },
      },
    },
  })
  checkAvailableBalance(
    @CurrentUser() user: AuthContext,
    @Param('currency') currency: CurrencyCode,
  ) {
    return this.service.checkAvailableBalance(user, currency);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiResponse({
    status: 200,
    description: 'The account',
    type: AccountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
  }
}
