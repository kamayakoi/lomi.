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

@ApiTags('Comptes')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly service: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les comptes' })
  @ApiResponse({
    status: 200,
    description: 'Liste des comptes',
    type: AccountResponseDto,
    isArray: true,
  })
  findAll(@CurrentUser() user: AuthContext) {
    return this.service.findAll(user);
  }

  @Get('balance')
  @ApiOperation({
    summary: 'Solde du compte',
    description:
      'Récupère le solde courant pour toutes les devises ou pour une devise précise',
  })
  @ApiQuery({
    name: 'currency',
    required: false,
    description: 'Filtrer par code devise (XOF, USD, EUR)',
    enum: ['XOF', 'USD', 'EUR'],
  })
  @ApiResponse({
    status: 200,
    description: 'Informations de solde',
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
    summary: 'Détail du solde',
    description:
      'Récupère le détail des soldes (disponible, en attente, total). Conversion optionnelle vers une devise cible.',
  })
  @ApiQuery({
    name: 'target_currency',
    required: false,
    description: 'Devise cible pour la conversion (XOF, USD, EUR)',
    enum: ['XOF', 'USD', 'EUR'],
  })
  @ApiResponse({
    status: 200,
    description: 'Détail des soldes avec conversion',
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
    summary: 'Vérifier le solde disponible',
    description:
      'Vérifie si le marchand dispose d’un solde disponible suffisant dans la devise indiquée',
  })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la vérification de solde',
    schema: {
      type: 'object',
      properties: {
        has_sufficient_balance: {
          type: 'boolean',
          description: 'Indique si des fonds sont disponibles',
        },
        available_balance: {
          type: 'number',
          description: 'Solde disponible actuel',
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
  @ApiOperation({ summary: 'Obtenir un compte par ID' })
  @ApiResponse({
    status: 200,
    description: 'Le compte',
    type: AccountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Compte introuvable',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
  }
}
