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

@ApiTags('Organisations')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get()
  @ApiOperation({
    summary: "Détails de l'organisation",
    description:
      "Renvoie les informations de l'organisation du marchand authentifié",
  })
  @ApiResponse({
    status: 200,
    description: "Détails de l'organisation",
    type: OrganizationResponseDto,
    isArray: true,
  })
  findAll(@CurrentUser() user: AuthContext) {
    return this.service.findAll(user);
  }

  @Get('metrics')
  @ApiOperation({
    summary: "Indicateurs de l'organisation",
    description:
      "Renvoie le MRR, l'ARR, la LTV, le chiffre d'affaires et le nombre de clients pour votre organisation.",
  })
  @ApiResponse({
    status: 200,
    description: "Indicateurs de l'organisation",
    type: OrganizationMetricsResponseDto,
  })
  getMetrics(@CurrentUser() user: AuthContext) {
    return this.service.getMetrics(user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Organisation par ID',
    description:
      "Renvoie les détails d'une organisation par son identifiant (doit correspondre à l'organisation authentifiée)",
  })
  @ApiResponse({
    status: 200,
    description: "L'organisation",
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organisation introuvable ou accès refusé',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.service.findOne(id, user);
  }
}
