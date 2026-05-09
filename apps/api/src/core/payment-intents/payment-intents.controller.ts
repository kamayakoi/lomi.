import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
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
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { PaymentIntentResponseDto } from './dto/payment-intent-response.dto';
import { PaymentIntentsService } from './payment-intents.service';

@ApiTags('Intents de paiement')
@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('payment-intents')
export class PaymentIntentsController {
  constructor(private readonly service: PaymentIntentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Créer un Payment Intent carte (client_secret)',
    description:
      'Crée un Payment Intent carte pour une intégration via Payment Element et renvoie le client_secret.',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment Intent créé avec succès',
    type: PaymentIntentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Entrée invalide ou erreur de préparation du montant',
  })
  @ApiResponse({
    status: 401,
    description: 'Clé API invalide ou manquante',
  })
  @ApiResponse({
    status: 503,
    description:
      'Le processeur de paiement carte n’est pas configuré sur cette instance API',
  })
  @ApiBody({
    type: CreatePaymentIntentDto,
    examples: {
      minimal: {
        summary: 'Sans customer_id (e-mail + nom)',
        value: {
          amount: 10000,
          currency_code: 'XOF',
          customer_email: 'client@example.com',
          customer_name: 'Ada Lovelace',
        },
      },
      withCustomer: {
        summary: 'Avec client + metadata',
        value: {
          amount: 25000,
          currency_code: 'XOF',
          customer_id: '550e8400-e29b-41d4-a716-446655440000',
          customer_email: 'john@example.com',
          customer_name: 'John Doe',
          description: 'Invoice #INV-2026-001',
          payment_reference: 'INV-2026-001',
          metadata: {
            order_id: 'ORD-2026-001',
            source: 'mobile_app',
          },
        },
      },
    },
  })
  create(
    @Body() createDto: CreatePaymentIntentDto,
    @CurrentUser() user: AuthContext,
  ) {
    return this.service.create(createDto, user);
  }
}
