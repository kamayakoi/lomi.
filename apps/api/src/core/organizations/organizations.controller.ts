import { Controller, UseGuards, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { OrganizationMetricsResponseDto } from './dto/organization-metrics-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Organizations')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get organization details',
    description: "Returns the authenticated merchant's organization details",
  })
  @ApiResponse({
    status: 200,
    description: 'Organization details',
    type: OrganizationResponseDto,
    isArray: true,
  })
  findAll(@CurrentUser() user: AuthContext) {
    return this.service.findAll(user);
  }

  @Get('metrics')
  @ApiOperation({
    summary: 'Get organization metrics',
    description:
      'Get comprehensive metrics including MRR, ARR, LTV, revenue, and customer counts. All metrics are pre-calculated and stored in the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization metrics (pre-calculated values)',
    type: OrganizationMetricsResponseDto,
  })
  getMetrics(@CurrentUser() user: AuthContext) {
    return this.service.getMetrics(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get organization by ID',
    description:
      'Returns organization details by ID (must match authenticated organization)',
  })
  @ApiResponse({
    status: 200,
    description: 'The organization',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found or access denied',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
  }
}
