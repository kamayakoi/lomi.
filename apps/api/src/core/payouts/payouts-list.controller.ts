import {
  Controller,
  Get,
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
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';
import { PayoutsService } from './payouts.service';

@ApiTags('Virements sortants')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('payouts')
export class PayoutsListController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les virements',
    description:
      'Liste les virements du marchand pour l’organisation (RPC fetch_payouts).',
  })
  @ApiQuery({ name: 'status', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Liste des virements' })
  async findAll(
    @CurrentUser() user: AuthContext,
    @Query('status') status?: string | string[],
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('pageSize', new DefaultValuePipe(50), ParseIntPipe) pageSize = 50,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const statuses = status
      ? Array.isArray(status)
        ? status
        : [status]
      : undefined;
    return this.payoutsService.findAll(
      user,
      statuses,
      page,
      pageSize,
      startDate,
      endDate,
    );
  }
}
