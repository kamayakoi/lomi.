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
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { BeneficiaryPayoutsService } from './beneficiary-payouts.service';
import { CreateBeneficiaryPayoutDto } from './dto/create-beneficiary-payout.dto';
import { BeneficiaryPayoutResponseDto } from './dto/beneficiary-payout-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Beneficiary Payouts')
@ApiSecurity('api-key')
@ApiExtraModels(BeneficiaryPayoutResponseDto)
@UseGuards(ApiKeyGuard)
@Controller('beneficiary-payouts')
export class BeneficiaryPayoutsController {
  constructor(private readonly service: BeneficiaryPayoutsService) {}

  @Post()
  @ApiOperation({
    summary: 'Initiate a beneficiary payout',
    description:
      'Initiates a payout to a beneficiary (contractor, supplier, employee, etc.). Returns immediately with pending status. The actual payout is processed asynchronously by the payment provider (Wave, SPI). Status updates are sent via webhooks. Use this for paying external parties from your account balance.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Beneficiary payout initiated successfully with pending status',
    type: BeneficiaryPayoutResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or insufficient balance',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  create(
    @Body() createDto: CreateBeneficiaryPayoutDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.create(createDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'List all beneficiary payouts',
    description:
      'Returns all beneficiary payouts for your organization with pagination and optional filtering by status, date range, and currency.',
  })
  @ApiQuery({
    name: 'statuses',
    required: false,
    description: 'Filter by payout statuses (comma-separated)',
    type: String,
    example: 'pending,completed,failed',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by start date (ISO 8601)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by end date (ISO 8601)',
    type: String,
  })
  @ApiQuery({
    name: 'currencyCode',
    required: false,
    description: 'Filter by currency code',
    type: String,
    example: 'XOF',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results to return',
    type: Number,
    example: 50,
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
    description: 'List of beneficiary payouts with pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(BeneficiaryPayoutResponseDto) },
        },
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
    @Query('statuses') statuses?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('currencyCode') currencyCode?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    const statusArray = statuses ? statuses.split(',') : undefined;
    return this.service.findAll(
      user,
      statusArray,
      startDate,
      endDate,
      currencyCode,
      limit,
      offset,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a beneficiary payout by ID',
    description:
      'Returns detailed information about a specific beneficiary payout, including its current status and provider details.',
  })
  @ApiParam({
    name: 'id',
    description: 'Beneficiary payout UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Beneficiary payout details',
    type: BeneficiaryPayoutResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Beneficiary payout not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
  }
}
