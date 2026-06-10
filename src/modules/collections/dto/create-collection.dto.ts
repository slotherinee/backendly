import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { ALLOWED_METHODS } from '../constants/collections.constants';

export class CreateCollectionDto {
  @IsString()
  @MaxLength(64)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'name must be lowercase letters, numbers and hyphens',
  })
  name: string;

  @IsString()
  @MaxLength(64)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'slug must be lowercase letters, numbers and hyphens',
  })
  slug: string;

  @IsOptional()
  @IsArray()
  @IsIn(ALLOWED_METHODS, { each: true })
  publicMethods?: string[];

  @IsOptional()
  @IsArray()
  @IsIn(ALLOWED_METHODS, { each: true })
  protectedMethods?: string[];

  @IsOptional()
  @IsObject()
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
}
