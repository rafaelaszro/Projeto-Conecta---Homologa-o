import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Comissao,
  ComissaoDocument,
  PapelComissao,
} from './schemas/comissao.schema.js';

import {
  Organizacao,
  OrganizacaoDocument,
  StatusMembroOrganizacao,
} from '../organizacoes/schemas/organizacao.schema.js';

import {
  Usuario,
  UsuarioDocument,
} from '../usuarios/schemas/usuario.schema.js';

import { CreateComissaoDto } from './dto/create-comissao.dto.js';
import { UpdateComissaoDto } from './dto/update-comissao.dto.js';
import { AddMembroComissaoDto } from './dto/add-membro-comissao.dto.js';

@Injectable()
export class ComissoesService {
  constructor(
    @InjectModel(Comissao.name)
    private readonly comissaoModel: Model<ComissaoDocument>,

    @InjectModel(Organizacao.name)
    private readonly organizacaoModel: Model<OrganizacaoDocument>,

    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async criar(createComissaoDto: CreateComissaoDto) {
    const organizacao = await this.organizacaoModel
      .findById(createComissaoDto.organizacaoId)
      .exec();

    if (!organizacao) {
      throw new NotFoundException('Organização não encontrada');
    }

    const comissao = await this.comissaoModel.create({
      nome: createComissaoDto.nome,
      descricao: createComissaoDto.descricao,
      organizacaoId: new Types.ObjectId(createComissaoDto.organizacaoId),
      membros: [],
      ativo: true,
    });

    return comissao;
  }

  async listar() {
    return this.comissaoModel
      .find()
      .populate('organizacaoId', 'nome status')
      .populate('membros.usuarioId', 'nome email ativo')
      .sort({ criadoEm: -1 })
      .exec();
  }

  async buscarPorId(id: string) {
    this.validarId(id);

    const comissao = await this.comissaoModel
      .findById(id)
      .populate('organizacaoId', 'nome status')
      .populate('membros.usuarioId', 'nome email ativo')
      .exec();

    if (!comissao) {
      throw new NotFoundException('Comissão não encontrada');
    }

    return comissao;
  }

  async atualizar(id: string, updateComissaoDto: UpdateComissaoDto) {
    this.validarId(id);

    const comissao = await this.comissaoModel
      .findByIdAndUpdate(id, updateComissaoDto, {
        new: true,
      })
      .populate('organizacaoId', 'nome status')
      .populate('membros.usuarioId', 'nome email ativo')
      .exec();

    if (!comissao) {
      throw new NotFoundException('Comissão não encontrada');
    }

    return comissao;
  }

  async remover(id: string) {
    this.validarId(id);

    const comissao = await this.comissaoModel
      .findByIdAndUpdate(
        id,
        {
          ativo: false,
        },
        {
          new: true,
        },
      )
      .exec();

    if (!comissao) {
      throw new NotFoundException('Comissão não encontrada');
    }

    return {
      mensagem: 'Comissão desativada com sucesso',
      comissao,
    };
  }

  async adicionarMembro(id: string, addMembroDto: AddMembroComissaoDto) {
    this.validarId(id);
    this.validarId(addMembroDto.usuarioId);

    const comissao = await this.comissaoModel.findById(id).exec();

    if (!comissao) {
      throw new NotFoundException('Comissão não encontrada');
    }

    const usuario = await this.usuarioModel
      .findById(addMembroDto.usuarioId)
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (!usuario.ativo) {
      throw new BadRequestException('Usuário está desativado');
    }

    const organizacao = await this.organizacaoModel
      .findById(comissao.organizacaoId)
      .exec();

    if (!organizacao) {
      throw new NotFoundException('Organização da comissão não encontrada');
    }

    const membroOrganizacao = organizacao.membros.find(
      (membro) => membro.usuarioId.toString() === addMembroDto.usuarioId,
    );

    if (
      !membroOrganizacao ||
      membroOrganizacao.status !== StatusMembroOrganizacao.APROVADO
    ) {
      throw new BadRequestException(
        'O usuário precisa ser membro aprovado da organização',
      );
    }

    const jaExiste = comissao.membros.some(
      (membro) => membro.usuarioId.toString() === addMembroDto.usuarioId,
    );

    if (jaExiste) {
      throw new ConflictException('Usuário já pertence a esta comissão');
    }

    comissao.membros.push({
      usuarioId: new Types.ObjectId(addMembroDto.usuarioId),
      papel: addMembroDto.papel ?? PapelComissao.MEMBRO,
      adicionadoEm: new Date(),
    });

    await comissao.save();

    return this.buscarPorId(id);
  }

  async removerMembro(id: string, usuarioId: string) {
    this.validarId(id);
    this.validarId(usuarioId);

    const comissao = await this.comissaoModel.findById(id).exec();

    if (!comissao) {
      throw new NotFoundException('Comissão não encontrada');
    }

    const membroExiste = comissao.membros.some(
      (membro) => membro.usuarioId.toString() === usuarioId,
    );

    if (!membroExiste) {
      throw new NotFoundException('Usuário não pertence a esta comissão');
    }

    comissao.membros = comissao.membros.filter(
      (membro) => membro.usuarioId.toString() !== usuarioId,
    );

    await comissao.save();

    return this.buscarPorId(id);
  }

  private validarId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }
  }
}
