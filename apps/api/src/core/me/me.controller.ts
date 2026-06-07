import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';
import { MeResponseDto } from './dto/me-response.dto';
import { MeService } from './me.service';

@ApiTags('Identité')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('me')
export class MeController {
  constructor(private readonly service: MeService) {}

  @Get()
  @ApiOperation({
    summary: 'Identité du compte API',
    description:
      'Retourne le marchand, l’organisation et l’environnement associés à la clé API courante.',
  })
  @ApiResponse({ status: 200, type: MeResponseDto })
  getMe(@CurrentUser() user: AuthContext): Promise<MeResponseDto> {
    return this.service.getMe(user);
  }
}
