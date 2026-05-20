import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { CustomerDto } from './create-charge.dto';

export class CreateMtnChargeDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @IsUUID()
  @IsOptional()
  merchantId?: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  @IsNotEmpty()
  customer: CustomerDto;

  @IsString()
  @IsOptional()
  description?: string;

  /** ISO 3166-1 alpha-2 (default CI). */
  @IsString()
  @IsOptional()
  @Length(2, 2)
  countryCode?: string;

  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsUUID()
  @IsOptional()
  subscriptionId?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  quantity?: number;
}
