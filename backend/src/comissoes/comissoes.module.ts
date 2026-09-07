import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComissoesService } from './comissoes.service.js';
import { ComissoesController } from './comissoes.controller.js';
import { Comissao, ComissaoSchema } from './schemas/comissao.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comissao.name,
        schema: ComissaoSchema,
      },
    ]),
  ],
  controllers: [ComissoesController],
  providers: [ComissoesService],
  exports: [ComissoesService],
})
export class ComissoesModule {}
