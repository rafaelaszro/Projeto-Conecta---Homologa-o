import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { OrganizacoesService } from './organizacoes.service.js';

import { CreateOrganizacaoDto } from './dto/create-organizacao.dto.js';
import { UpdateOrganizacaoDto } from './dto/update-organizacao.dto.js';
import { AddMembroOrganizacaoDto } from './dto/add-membro-organizacao.dto.js';
import { UpdateStatusMembroDto } from './dto/update-status-membro.dto.js';
import { JwtAuthGuard, type RequisicaoAutenticada } from '../auth/jwt-auth.guard.js';
import { AdminSistemaGuard } from '../auth/admin-sistema.guard.js';

@Controller('organizacoes')
export class OrganizacoesController {
  constructor(private readonly organizacoesService: OrganizacoesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  criar(
    @Req() requisicao: RequisicaoAutenticada,
    @Body() createOrganizacaoDto: CreateOrganizacaoDto,
  ) {
    return this.organizacoesService.criar(requisicao.usuario.sub, createOrganizacaoDto);
  }

  @UseGuards(JwtAuthGuard, AdminSistemaGuard)
  @Get()
  listar() {
    return this.organizacoesService.listar();
  }

  @UseGuards(JwtAuthGuard, AdminSistemaGuard)
  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.organizacoesService.buscarPorId(id);
  }

  @UseGuards(JwtAuthGuard, AdminSistemaGuard)
  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() updateOrganizacaoDto: UpdateOrganizacaoDto,
  ) {
    return this.organizacoesService.atualizar(id, updateOrganizacaoDto);
  }

  @UseGuards(JwtAuthGuard, AdminSistemaGuard)
  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.organizacoesService.remover(id);
  }

  @UseGuards(JwtAuthGuard, AdminSistemaGuard)
  @Post(':id/membros')
  adicionarMembro(
    @Param('id') id: string,
    @Body() addMembroDto: AddMembroOrganizacaoDto,
  ) {
    return this.organizacoesService.adicionarMembro(id, addMembroDto);
  }

  @UseGuards(JwtAuthGuard, AdminSistemaGuard)
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
