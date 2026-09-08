import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { StatusOrganizacao } from '../schemas/organizacao.schema.js';

export class CreateOrganizacaoDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsMongoId()
  criadaPor: string;

  @IsOptional()
  @IsEnum(StatusOrganizacao)
  status?: StatusOrganizacao;
}
