import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { OrganizacoesService } from './organizacoes.service.js';

import { CreateOrganizacaoDto } from './dto/create-organizacao.dto.js';
import { UpdateOrganizacaoDto } from './dto/update-organizacao.dto.js';
import { AddMembroOrganizacaoDto } from './dto/add-membro-organizacao.dto.js';
import { UpdateStatusMembroDto } from './dto/update-status-membro.dto.js';

@Controller('organizacoes')
export class OrganizacoesController {
  constructor(private readonly organizacoesService: OrganizacoesService) {}

  @Post()
  criar(@Body() createOrganizacaoDto: CreateOrganizacaoDto) {
    return this.organizacoesService.criar(createOrganizacaoDto);
  }

  @Get()
  listar() {
    return this.organizacoesService.listar();
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.organizacoesService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() updateOrganizacaoDto: UpdateOrganizacaoDto,
  ) {
    return this.organizacoesService.atualizar(id, updateOrganizacaoDto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.organizacoesService.remover(id);
  }

  @Post(':id/membros')
  adicionarMembro(
    @Param('id') id: string,
    @Body() addMembroDto: AddMembroOrganizacaoDto,
  ) {
    return this.organizacoesService.adicionarMembro(id, addMembroDto);
  }

  @Patch(':id/membros/:usuarioId')
  atualizarStatusMembro(
    @Param('id') id: string,
    @Param('usuarioId') usuarioId: string,
    @Body() updateStatusDto: UpdateStatusMembroDto,
  ) {
    return this.organizacoesService.atualizarStatusMembro(
      id,
      usuarioId,
      updateStatusDto,
    );
  }
}
