import { IsEnum } from 'class-validator';

import { StatusMembroOrganizacao } from '../schemas/organizacao.schema.js';

export class UpdateStatusMembroDto {
  @IsEnum(StatusMembroOrganizacao)
  status: StatusMembroOrganizacao;
}
