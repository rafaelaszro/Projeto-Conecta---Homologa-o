import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { Usuario, UsuarioDocument } from './schemas/usuario.schema.js';

import { CreateUsuarioDto } from './dto/create-usuario.dto.js';

import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async criar(createUsuarioDto: CreateUsuarioDto) {
    const email = createUsuarioDto.email.toLowerCase().trim();

    const usuarioExistente = await this.usuarioModel.findOne({ email }).exec();

    if (usuarioExistente) {
      throw new ConflictException('Já existe um usuário com este email');
    }

    const senhaHash = await bcrypt.hash(createUsuarioDto.senha, 10);

    const usuario = await this.usuarioModel.create({
      nome: createUsuarioDto.nome,
      email,
      senhaHash,
      tipo: createUsuarioDto.tipo,
      tema: createUsuarioDto.tema,
      ativo: createUsuarioDto.ativo,
    });

    return this.usuarioModel.findById(usuario._id).exec();
  }

  async listar() {
    return this.usuarioModel.find().sort({ criadoEm: -1 }).exec();
  }

  async buscarPorId(id: string) {
    this.validarId(id);

    const usuario = await this.usuarioModel.findById(id).exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async atualizar(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    this.validarId(id);

    const usuario = await this.usuarioModel
      .findById(id)
      .select('+senhaHash')
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUsuarioDto.email) {
      const email = updateUsuarioDto.email.toLowerCase().trim();

      const usuarioComMesmoEmail = await this.usuarioModel
        .findOne({
          email,
          _id: { $ne: id },
        })
        .exec();

      if (usuarioComMesmoEmail) {
        throw new ConflictException('Já existe um usuário com este email');
      }

      usuario.email = email;
    }

    if (updateUsuarioDto.nome !== undefined) {
      usuario.nome = updateUsuarioDto.nome;
    }

    if (updateUsuarioDto.tipo !== undefined) {
      usuario.tipo = updateUsuarioDto.tipo;
    }

    if (updateUsuarioDto.tema !== undefined) {
      usuario.tema = updateUsuarioDto.tema;
    }

    if (updateUsuarioDto.ativo !== undefined) {
      usuario.ativo = updateUsuarioDto.ativo;
    }

    if (updateUsuarioDto.senha) {
      usuario.senhaHash = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    await usuario.save();

    return this.usuarioModel.findById(id).exec();
  }

  async remover(id: string) {
    this.validarId(id);

    const usuario = await this.usuarioModel
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

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      mensagem: 'Usuário desativado com sucesso',
      usuario,
    };
  }

  private validarId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuário inválido');
    }
  }
}
