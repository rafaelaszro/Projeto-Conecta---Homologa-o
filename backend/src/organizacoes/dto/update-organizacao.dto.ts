import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { StatusOrganizacao } from '../schemas/organizacao.schema.js';

export class UpdateOrganizacaoDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsEnum(StatusOrganizacao)
  status?: StatusOrganizacao;
}
