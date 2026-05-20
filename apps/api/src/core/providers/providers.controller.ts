import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { ProvidersService } from './providers.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';
import type { ProviderCode } from '../../utils/types/api';

@ApiTags('Providers')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  @ApiOperation({
    summary: 'List payment providers',
    description:
      'Returns connection status for payment providers configured for your organization.',
  })
  @ApiQuery({
    name: 'provider_code',
    required: false,
    enum: ['STRIPE', 'WAVE', 'MTN', 'SPI'],
  })
  @ApiResponse({ status: 200, description: 'Provider settings' })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('provider_code') providerCode?: ProviderCode,
  ) {
    return this.providersService.findAll(user, providerCode);
  }
}
