import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

export enum TipoUsuario {
  USUARIO = 'USUARIO',
  ADMIN_SISTEMA = 'ADMIN_SISTEMA',
}

@Schema({
  timestamps: {
    createdAt: 'criadoEm',
    updatedAt: 'atualizadoEm',
  },
})
export class Usuario {
  @Prop({
    required: true,
    trim: true,
  })
  nome: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    select: false,
  })
  senhaHash: string;

  @Prop({
    enum: TipoUsuario,
    default: TipoUsuario.USUARIO,
  })
  tipo: TipoUsuario;

  @Prop({
    default: 'claro',
  })
  tema: string;

  @Prop({
    default: true,
  })
  ativo: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
