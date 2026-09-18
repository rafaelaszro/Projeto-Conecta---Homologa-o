import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrganizacoesController } from './organizacoes.controller.js';
import { OrganizacoesService } from './organizacoes.service.js';

import {
  Organizacao,
  OrganizacaoSchema,
} from './schemas/organizacao.schema.js';

import { Usuario, UsuarioSchema } from '../usuarios/schemas/usuario.schema.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: Organizacao.name,
        schema: OrganizacaoSchema,
      },
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]),
  ],
  controllers: [OrganizacoesController],
  providers: [OrganizacoesService],
  exports: [OrganizacoesService],
})
export class OrganizacoesModule {}
