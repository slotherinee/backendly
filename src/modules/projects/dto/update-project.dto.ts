import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  allowedOrigins?: string[];

  // IPv4, IPv6,CIDR: "192.168.1.1", "10.0.0.0/24", "::1"
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[\d.:a-fA-F/]+$/, {
    each: true,
    message: 'each IP must be a valid IPv4, IPv6 or CIDR',
  })
  @IsOptional()
  ipWhitelist?: string[];
}
