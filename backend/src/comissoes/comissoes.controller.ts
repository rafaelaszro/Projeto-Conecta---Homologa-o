import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ComissoesService } from './comissoes.service.js';

import { CreateComissaoDto } from './dto/create-comissao.dto.js';
import { UpdateComissaoDto } from './dto/update-comissao.dto.js';
import { AddMembroComissaoDto } from './dto/add-membro-comissao.dto.js';

@Controller('comissoes')
export class ComissoesController {
  constructor(private readonly comissoesService: ComissoesService) {}

  @Post()
  criar(@Body() createComissaoDto: CreateComissaoDto) {
    return this.comissoesService.criar(createComissaoDto);
  }

  @Get()
  listar() {
    return this.comissoesService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.comissoesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() updateComissaoDto: UpdateComissaoDto,
  ) {
    return this.comissoesService.atualizar(id, updateComissaoDto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.comissoesService.remover(id);
  }

  @Post(':id/membros')
  adicionarMembro(
    @Param('id') id: string,
    @Body() addMembroDto: AddMembroComissaoDto,
  ) {
    return this.comissoesService.adicionarMembro(id, addMembroDto);
  }

  @Delete(':id/membros/:usuarioId')
  removerMembro(
    @Param('id') id: string,
    @Param('usuarioId') usuarioId: string,
  ) {
    return this.comissoesService.removerMembro(id, usuarioId);
  }
}
