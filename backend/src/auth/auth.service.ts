import { Injectable, UnauthorizedException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import {
  Usuario,
  UsuarioDocument,
} from '../usuarios/schemas/usuario.schema.js';

import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,

    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const email = loginDto.email.toLowerCase().trim();

    const usuario = await this.usuarioModel
      .findOne({ email })
      .select('+senhaHash')
      .exec();

    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Usuário desativado');
    }

    const senhaValida = await bcrypt.compare(loginDto.senha, usuario.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = {
      sub: usuario._id.toString(),
      email: usuario.email,
      tipo: usuario.tipo,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,

      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        tema: usuario.tema,
      },
    };
  }
}
