import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
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
  ApiParam,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AddPriceDto } from './dto/add-price.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PriceResponseDto } from './dto/price-response.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import {
  CurrentUser,
  type AuthContext,
} from '../common/decorators/current-user.decorator';

@ApiTags('Products')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all products',
    description:
      "Returns all products for the authenticated merchant's organization. Products include embedded prices and fees. Use this to display your product catalog or integrate with external systems.",
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    type: Boolean,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of results to return',
    type: Number,
    example: 15,
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
    description: 'List of products with embedded prices',
    type: ProductResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findAll(
    @CurrentUser() user: AuthContext,
    @Query('isActive') isActiveStr?: string,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit?: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
  ) {
    const isActive =
      isActiveStr === 'true'
        ? true
        : isActiveStr === 'false'
          ? false
          : undefined;
    return this.productsService.findAll(user, isActive, limit, offset);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description:
      'Returns detailed information about a specific product, including all prices and fees. Only accessible if the product belongs to your organization.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Product details with embedded prices',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found or access denied',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.productsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Creates a new product with one or more prices. The product and all prices are created atomically - if any part fails, the entire operation is rolled back. At least one price is required. The first price (or the one marked as is_default) will be the default price.',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Post(':id/prices')
  @ApiOperation({
    summary: 'Add a new price to a product',
    description:
      'Adds an additional price option to an existing product. Useful for offering multiple pricing tiers, currencies, or billing intervals. Note: A product can have a maximum of 3 active prices. You cannot modify existing prices - create a new one instead.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Price added successfully',
    type: PriceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found or access denied',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or maximum prices exceeded',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  addPrice(
    @Param('id') id: string,
    @Body() addPriceDto: AddPriceDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.productsService.addPrice(id, addPriceDto, user);
  }

  @Post(':id/prices/:priceId/set-default')
  @ApiOperation({
    summary: 'Set a price as the default',
    description:
      "Sets a specific price as the default for a product. The default price is used when a customer doesn't specify a price ID in checkout. Only one price can be the default at a time - setting a new default automatically unsets the previous one.",
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: String,
  })
  @ApiParam({
    name: 'priceId',
    description: 'Price UUID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Default price updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Product or price not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing API key',
  })
  setDefaultPrice(
    @Param('id') id: string,
    @Param('priceId') priceId: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.productsService.setDefaultPrice(id, priceId, user);
  }
}
