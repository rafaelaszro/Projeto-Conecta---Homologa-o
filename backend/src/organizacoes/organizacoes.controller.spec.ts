import { Test, TestingModule } from '@nestjs/testing';
import { OrganizacoesController } from './organizacoes.controller.js';
import { OrganizacoesService } from './organizacoes.service.js';

describe('OrganizacoesController', () => {
  let controller: OrganizacoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizacoesController],
      providers: [{ provide: OrganizacoesService, useValue: {} }],
    }).compile();

    controller = module.get<OrganizacoesController>(OrganizacoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
