import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  merchant_id: string;

  @ApiProperty({ example: '987e6543-e89b-12d3-a456-426614174000' })
  organization_id: string;

  @ApiProperty({ example: 'Acme Corp' })
  organization_name: string;

  @ApiProperty({ example: 'test', enum: ['live', 'test'] })
  environment: string;
}
