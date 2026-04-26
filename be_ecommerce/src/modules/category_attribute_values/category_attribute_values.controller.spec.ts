import { Test, TestingModule } from '@nestjs/testing';
import { CategoryAttributeValuesController } from './category_attribute_values.controller';
import { CategoryAttributeValuesService } from './category_attribute_values.service';

describe('CategoryAttributeValuesController', () => {
  let controller: CategoryAttributeValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryAttributeValuesController],
      providers: [CategoryAttributeValuesService],
    }).compile();

    controller = module.get<CategoryAttributeValuesController>(CategoryAttributeValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
