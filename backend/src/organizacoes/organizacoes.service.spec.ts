import { Test, TestingModule } from '@nestjs/testing';
import { OrganizacoesService } from './organizacoes.service.js';
import { getModelToken } from '@nestjs/mongoose';
import { Organizacao } from './schemas/organizacao.schema.js';
import { Usuario } from '../usuarios/schemas/usuario.schema.js';

describe('OrganizacoesService', () => {
  let service: OrganizacoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizacoesService,
        { provide: getModelToken(Organizacao.name), useValue: {} },
        { provide: getModelToken(Usuario.name), useValue: {} },
      ],
    }).compile();

    service = module.get<OrganizacoesService>(OrganizacoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
