import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class WorkflowStepInputDto {
  @IsString()
  id: string;
}

export class CreateWorkflowDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  idempotency_key?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkflowStepInputDto)
  steps: WorkflowStepInputDto[];
}

export class UpdateWorkflowStepDto {
  @IsString()
  status: string;
}

export class CreateSubscriptionDto {
  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @IsIn(['sse', 'webhook', 'pull'])
  channel: 'sse' | 'webhook' | 'pull';

  @IsOptional()
  @IsString()
  webhook_url?: string;
}

export class CreateHandoffDto {
  @IsString()
  to: string;

  @IsString()
  task: string;

  @IsObject()
  context: Record<string, unknown>;

  @IsOptional()
  @IsString()
  trace_id?: string;
}
