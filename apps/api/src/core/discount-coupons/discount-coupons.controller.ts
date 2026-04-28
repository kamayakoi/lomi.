import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiParam,
} from '@nestjs/swagger';
import { DiscountCouponsService } from './discount-coupons.service';
import { CreateDiscountCouponDto } from './dto/create-discount-coupon.dto';
import { DiscountCouponResponseDto } from './dto/discount-coupon-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Coupons de réduction')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('discount-coupons')
export class DiscountCouponsController {
  constructor(
    private readonly discountCouponsService: DiscountCouponsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les coupons',
    description:
      "Renvoie tous les coupons de réduction de l'organisation du marchand authentifié.",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des coupons',
    type: DiscountCouponResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findAll(@CurrentUser() user: AuthContext) {
    return this.discountCouponsService.findAll(user);
  }

  @Get(':id/performance')
  @ApiOperation({
    summary: 'Indicateurs de performance du coupon',
    description:
      "Renvoie les statistiques d'utilisation et l'impact sur le chiffre d'affaires pour un coupon donné.",
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du coupon',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Indicateurs de performance',
    schema: {
      properties: {
        total_uses: { type: 'number', example: 45 },
        total_discount_amount: { type: 'number', example: 25000.0 },
        total_revenue: { type: 'number', example: 150000.0 },
        average_order_value: { type: 'number', example: 3333.33 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  getPerformance(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.discountCouponsService.getPerformance(id, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtenir un coupon par ID',
    description:
      "Renvoie un coupon. Réponse 404 s'il n'existe pas ou n'est pas accessible avec cette clé API.",
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du coupon',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Détails du coupon',
    type: DiscountCouponResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Coupon introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.discountCouponsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({
    summary: 'Créer un coupon',
    description:
      "Crée un coupon dans votre organisation. Le code sera automatiquement mis en majuscules.",
  })
  @ApiResponse({
    status: 201,
    description: 'Coupon créé avec succès',
    type: DiscountCouponResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou code déjà utilisé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  create(
    @Body() createDto: CreateDiscountCouponDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.discountCouponsService.create(createDto, user);
  }
}
