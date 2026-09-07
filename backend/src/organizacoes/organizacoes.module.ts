import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizacoesService } from './organizacoes.service.js';
import { OrganizacoesController } from './organizacoes.controller.js';
import {
  Organizacao,
  OrganizacaoSchema,
} from './schemas/organizacao.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Organizacao.name,
        schema: OrganizacaoSchema,
      },
    ]),
  ],
  controllers: [OrganizacoesController],
  providers: [OrganizacoesService],
  exports: [OrganizacoesService],
})
export class OrganizacoesModule {}
