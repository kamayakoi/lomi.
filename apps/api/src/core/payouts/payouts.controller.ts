import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';
import { PayoutsService } from './payouts.service';
import { CreateWavePayoutDto } from './dto/create-payout.dto';
import { PayoutResponseDto } from './dto/payout-response.dto';

@ApiTags('Payouts')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('payout')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) {}

  @Post('wave')
  @ApiOperation({
    summary: 'Initiate a Wave payout',
    description:
      'Creates a payout via the Wave edge function. Response shape is provider JSON.',
  })
  @ApiResponse({
    status: 201,
    description: 'Payout initiated (JSON body from Wave edge function)',
    type: PayoutResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or provider error' })
  @ApiResponse({ status: 401, description: 'Invalid or missing API key' })
  async createWavePayout(
    @Body() createPayoutDto: CreateWavePayoutDto,
    @CurrentUser() user: AuthContext,
  ) {
    createPayoutDto.organizationId = user.organizationId;
    createPayoutDto.merchantId = user.merchantId;
    return this.payoutsService.createWavePayout(createPayoutDto);
  }
}
