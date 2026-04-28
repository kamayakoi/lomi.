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

@ApiTags('Discount Coupons')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('discount-coupons')
export class DiscountCouponsController {
  constructor(
    private readonly discountCouponsService: DiscountCouponsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List all discount coupons',
    description:
      "Returns all discount coupons for the authenticated merchant's organization.",
  })
  @ApiResponse({
    status: 200,
    description: 'List of discount coupons',
    type: DiscountCouponResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findAll(@CurrentUser() user: AuthContext) {
    return this.discountCouponsService.findAll(user);
  }

  @Get(':id/performance')
  @ApiOperation({
    summary: 'Get coupon performance metrics',
    description:
      'Returns performance metrics for a specific discount coupon, including usage statistics and revenue impact.',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Coupon performance metrics',
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
    description: 'Discount coupon not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  getPerformance(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.discountCouponsService.getPerformance(id, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get discount coupon by ID',
    description:
      'Returns a single discount coupon. Responds with 404 if the coupon does not exist or is not available for this API key.',
  })
  @ApiParam({
    name: 'id',
    description: 'Coupon UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Discount coupon details',
    type: DiscountCouponResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Discount coupon not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.discountCouponsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new discount coupon',
    description:
      'Creates a new discount coupon in your organization. The coupon code will be automatically uppercased.',
  })
  @ApiResponse({
    status: 201,
    description: 'Discount coupon created successfully',
    type: DiscountCouponResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or coupon code already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  create(
    @Body() createDto: CreateDiscountCouponDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.discountCouponsService.create(createDto, user);
  }
}
