import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for customer resources.
 * Explicit `type` on each @ApiProperty avoids emitDecoratorMetadata picking up
 * inherited prototype keys (e.g. `name`, `email`) which breaks Nest Swagger schema generation.
 */
export class CustomerResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique customer identifier',
    type: String,
  })
  customer_id: string;

  @ApiProperty({
    example: '789e0123-e89b-12d3-a456-426614174000',
    description: 'Organization ID the customer belongs to',
    type: String,
  })
  organization_id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Customer full name',
    type: String,
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Customer email address',
    nullable: true,
    type: String,
  })
  email: string | null;

  @ApiProperty({
    example: '+221771234567',
    description: 'Customer phone number',
    nullable: true,
    type: String,
  })
  phone_number: string | null;

  @ApiProperty({
    example: '+221771234567',
    description: 'Customer WhatsApp number',
    nullable: true,
    type: String,
  })
  whatsapp_number: string | null;

  @ApiProperty({
    example: 'Senegal',
    description: 'Customer country',
    nullable: true,
    type: String,
  })
  country: string | null;

  @ApiProperty({
    example: 'Dakar',
    description: 'Customer city',
    nullable: true,
    type: String,
  })
  city: string | null;

  @ApiProperty({
    example: '123 Main Street',
    description: 'Customer street address',
    nullable: true,
    type: String,
  })
  address: string | null;

  @ApiProperty({
    example: '12345',
    description: 'Customer postal code',
    nullable: true,
    type: String,
  })
  postal_code: string | null;

  @ApiProperty({
    example: false,
    description: 'Whether the customer is a business',
    type: Boolean,
  })
  is_business: boolean;

  @ApiProperty({
    example: { custom_field: 'value' },
    description: 'Additional metadata as JSON',
    nullable: true,
    type: Object,
  })
  metadata: Record<string, any> | null;

  @ApiProperty({
    example: 'live',
    description: 'Environment (test or live)',
    enum: ['test', 'live'],
    type: String,
  })
  environment: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the customer was created',
    type: String,
  })
  created_at: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'When the customer was last updated',
    type: String,
  })
  updated_at: string;
}
