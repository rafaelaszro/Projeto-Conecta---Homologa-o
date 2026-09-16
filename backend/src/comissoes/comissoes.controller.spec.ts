import { Test, TestingModule } from '@nestjs/testing';
import { ComissoesController } from './comissoes.controller.js';
import { ComissoesService } from './comissoes.service.js';

describe('ComissoesController', () => {
  let controller: ComissoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComissoesController],
      providers: [{ provide: ComissoesService, useValue: {} }],
    }).compile();

    controller = module.get<ComissoesController>(ComissoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
