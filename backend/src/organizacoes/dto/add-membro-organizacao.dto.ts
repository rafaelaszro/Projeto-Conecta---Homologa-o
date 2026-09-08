import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

import { PapelOrganizacao } from '../schemas/organizacao.schema.js';

export class AddMembroOrganizacaoDto {
  @IsMongoId()
  usuarioId: string;

  @IsOptional()
  @IsEnum(PapelOrganizacao)
  papel?: PapelOrganizacao;
}
