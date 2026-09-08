import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Organizacao,
  OrganizacaoDocument,
  PapelOrganizacao,
  StatusMembroOrganizacao,
  StatusOrganizacao,
} from './schemas/organizacao.schema.js';

import {
  Usuario,
  UsuarioDocument,
} from '../usuarios/schemas/usuario.schema.js';

import { CreateOrganizacaoDto } from './dto/create-organizacao.dto.js';
import { UpdateOrganizacaoDto } from './dto/update-organizacao.dto.js';
import { AddMembroOrganizacaoDto } from './dto/add-membro-organizacao.dto.js';
import { UpdateStatusMembroDto } from './dto/update-status-membro.dto.js';

@Injectable()
export class OrganizacoesService {
  constructor(
    @InjectModel(Organizacao.name)
    private readonly organizacaoModel: Model<OrganizacaoDocument>,

    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async criar(createOrganizacaoDto: CreateOrganizacaoDto) {
    const usuario = await this.usuarioModel
      .findById(createOrganizacaoDto.criadaPor)
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário criador não encontrado');
    }

    const organizacao = await this.organizacaoModel.create({
      nome: createOrganizacaoDto.nome,
      descricao: createOrganizacaoDto.descricao,
      criadaPor: new Types.ObjectId(createOrganizacaoDto.criadaPor),
      status: createOrganizacaoDto.status ?? StatusOrganizacao.PENDENTE,

      membros: [
        {
          usuarioId: new Types.ObjectId(createOrganizacaoDto.criadaPor),
          papel: PapelOrganizacao.ADMIN,
          status: StatusMembroOrganizacao.APROVADO,
          solicitadoEm: new Date(),
          aprovadoEm: new Date(),
        },
      ],
    });

    return organizacao;
  }

  async listar() {
    return this.organizacaoModel
      .find()
      .populate('criadaPor', 'nome email tipo ativo')
      .populate('membros.usuarioId', 'nome email tipo ativo')
      .sort({ criadoEm: -1 })
      .exec();
  }

  async buscarPorId(id: string) {
    this.validarId(id);

    const organizacao = await this.organizacaoModel
      .findById(id)
      .populate('criadaPor', 'nome email tipo ativo')
      .populate('membros.usuarioId', 'nome email tipo ativo')
      .exec();

    if (!organizacao) {
      throw new NotFoundException('Organização não encontrada');
    }

    return organizacao;
  }

  async atualizar(id: string, updateOrganizacaoDto: UpdateOrganizacaoDto) {
    this.validarId(id);

    const organizacao = await this.organizacaoModel
      .findByIdAndUpdate(id, updateOrganizacaoDto, { new: true })
      .populate('criadaPor', 'nome email tipo ativo')
      .populate('membros.usuarioId', 'nome email tipo ativo')
      .exec();

    if (!organizacao) {
      throw new NotFoundException('Organização não encontrada');
    }

    return organizacao;
  }

  async remover(id: string) {
    this.validarId(id);

    const organizacao = await this.organizacaoModel
      .findByIdAndUpdate(
        id,
        {
          status: StatusOrganizacao.REVOGADA,
        },
        {
          new: true,
        },
      )
      .exec();

    if (!organizacao) {
      throw new NotFoundException('Organização não encontrada');
    }

    return {
      mensagem: 'Organização revogada com sucesso',
      organizacao,
    };
  }

  async adicionarMembro(id: string, addMembroDto: AddMembroOrganizacaoDto) {
    this.validarId(id);
    this.validarId(addMembroDto.usuarioId);

    const organizacao = await this.organizacaoModel.findById(id).exec();

    if (!organizacao) {
      throw new NotFoundException('Organização não encontrada');
    }

    const usuario = await this.usuarioModel
      .findById(addMembroDto.usuarioId)
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const jaExiste = organizacao.membros.some(
      (membro) => membro.usuarioId.toString() === addMembroDto.usuarioId,
    );

    if (jaExiste) {
      throw new ConflictException(
        'Usuário já pertence ou possui solicitação nesta organização',
      );
    }

    organizacao.membros.push({
      usuarioId: new Types.ObjectId(addMembroDto.usuarioId),
      papel: addMembroDto.papel ?? PapelOrganizacao.MEMBRO,
      status: StatusMembroOrganizacao.PENDENTE,
      solicitadoEm: new Date(),
    });

    await organizacao.save();

    return this.buscarPorId(id);
  }

  async atualizarStatusMembro(
    id: string,
    usuarioId: string,
    updateStatusDto: UpdateStatusMembroDto,
  ) {
    this.validarId(id);
    this.validarId(usuarioId);

    const organizacao = await this.organizacaoModel.findById(id).exec();

    if (!organizacao) {
      throw new NotFoundException('Organização não encontrada');
    }

    const membro = organizacao.membros.find(
      (item) => item.usuarioId.toString() === usuarioId,
    );

    if (!membro) {
      throw new NotFoundException('Membro não encontrado nesta organização');
    }

    membro.status = updateStatusDto.status;

    if (updateStatusDto.status === StatusMembroOrganizacao.APROVADO) {
      membro.aprovadoEm = new Date();
    } else {
      membro.aprovadoEm = undefined;
    }

    await organizacao.save();

    return this.buscarPorId(id);
  }

  private validarId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID inválido');
    }
  }
}
