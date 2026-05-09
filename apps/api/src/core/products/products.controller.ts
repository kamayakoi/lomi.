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

@ApiTags('Produits')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lister les produits',
    description:
      "Renvoie tous les produits de l'organisation du marchand authentifié, avec prix et frais intégrés. Utile pour afficher le catalogue ou intégrer des systèmes externes.",
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filtrer par statut actif',
    type: Boolean,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre maximal de résultats',
    type: Number,
    example: 15,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Décalage pour la pagination',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits avec prix embarqués',
    type: ProductResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
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
    summary: 'Obtenir un produit par ID',
    description:
      "Renvoie un produit avec ses prix et frais. Réponse 404 s'il n'existe pas ou n'est pas accessible avec cette clé API.",
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du produit',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Détails du produit avec prix embarqués',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produit introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthContext) {
    return this.productsService.findOne(id, user);
  }

  @Post()
  @ApiOperation({
    summary: 'Créer un produit',
    description:
      "Crée un produit avec un ou plusieurs tarifs en une seule requête. Au moins un prix est requis. Le premier prix, ou celui avec `is_default`, est utilisé lorsque aucun prix n'est précisé au paiement.",
  })
  @ApiResponse({
    status: 201,
    description: 'Produit créé avec succès',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Entrée invalide ou erreur de validation',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Post(':id/prices')
  @ApiOperation({
    summary: 'Ajouter un prix à un produit',
    description:
      'Ajoute une nouvelle option tarifaire à un produit (palier, devise ou période). Un produit ne peut avoir au plus 3 prix actifs. Les prix existants ne se modifient pas : créez-en un nouveau.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du produit',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: 'Prix ajouté avec succès',
    type: PriceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produit introuvable ou accès refusé',
  })
  @ApiResponse({
    status: 400,
    description: 'Entrée invalide ou nombre maximal de prix dépassé',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
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
    summary: 'Définir le prix par défaut',
    description:
      "Indique le prix utilisé par défaut pour ce produit (par exemple si le paiement ne fournit pas d'ID de prix). Un seul défaut à la fois ; un nouveau défaut remplace l'ancien.",
  })
  @ApiParam({
    name: 'id',
    description: 'UUID du produit',
    type: String,
  })
  @ApiParam({
    name: 'priceId',
    description: 'UUID du prix',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Prix par défaut mis à jour',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Produit ou prix introuvable',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  setDefaultPrice(
    @Param('id') id: string,
    @Param('priceId') priceId: string,
    @CurrentUser() user: AuthContext,
  ) {
    return this.productsService.setDefaultPrice(id, priceId, user);
  }
}
