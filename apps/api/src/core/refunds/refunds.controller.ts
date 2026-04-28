import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiSecurity,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { RefundsService } from './refunds.service';
import { CreateWaveRefundDto } from './dto/create-refund.dto';
import { RefundResponseDto } from './dto/refund-response.dto';

@ApiTags('Refunds')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('refund')
export class RefundsController {
  constructor(private readonly refundsService: RefundsService) {}

  @Post('wave')
  @ApiOperation({
    summary: 'Initiate a Wave refund',
    description:
      'Creates a refund via the Wave edge function. Response shape is provider JSON.',
  })
  @ApiResponse({
    status: 201,
    description: 'Refund result (JSON body from Wave edge function)',
    type: RefundResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Refund processing failed' })
  async createWaveRefund(@Body() createRefundDto: CreateWaveRefundDto) {
    return this.refundsService.createWaveRefund(createRefundDto);
  }
}
