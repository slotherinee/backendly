import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import {
  ALLOWED_METHODS,
  MAX_COLLECTION_LIMIT,
} from '../constants/collections.constants';
import { IsJsonSchema } from '@common/decorators/is-json-schema.decorator';

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'name must be lowercase letters, numbers and hyphens',
  })
  name?: string;

  @IsOptional()
  @IsArray()
  @IsIn(ALLOWED_METHODS, { each: true })
  publicMethods?: string[];

  @IsOptional()
  @IsArray()
  @IsIn(ALLOWED_METHODS, { each: true })
  protectedMethods?: string[];

  @IsOptional()
  @IsJsonSchema()
  validationSchema?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  cacheEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  cacheTtl?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxItems?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_COLLECTION_LIMIT)
  defaultLimit?: number;
}
