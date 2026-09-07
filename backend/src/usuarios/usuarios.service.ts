import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

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
    const usuario = new this.usuarioModel(createUsuarioDto);

    return usuario.save();
  }

  async listar() {
    return this.usuarioModel.find().exec();
  }

  async buscarPorId(id: string) {
    const usuario = await this.usuarioModel.findById(id).exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async atualizar(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioModel
      .findByIdAndUpdate(id, updateUsuarioDto, {
        new: true,
      })
      .exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }

  async remover(id: string) {
    const usuario = await this.usuarioModel.findByIdAndDelete(id).exec();

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return usuario;
  }
}
