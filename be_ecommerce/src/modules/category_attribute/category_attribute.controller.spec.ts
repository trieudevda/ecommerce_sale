import { Test, TestingModule } from '@nestjs/testing';
import { CategoryAttributeController } from './category_attribute.controller';
import { CategoryAttributeService } from './category_attribute.service';

describe('CategoryAttributeController', () => {
  let controller: CategoryAttributeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryAttributeController],
      providers: [CategoryAttributeService],
    }).compile();

    controller = module.get<CategoryAttributeController>(CategoryAttributeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
