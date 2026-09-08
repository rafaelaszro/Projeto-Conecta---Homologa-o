import { IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateComissaoDto {
  @IsString()
  @MinLength(2)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsMongoId()
  organizacaoId: string;
}
