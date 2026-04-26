import { Test, TestingModule } from '@nestjs/testing';
import { CategoryAttributeValuesService } from './category_attribute_values.service';

describe('CategoryAttributeValuesService', () => {
  let service: CategoryAttributeValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryAttributeValuesService],
    }).compile();

    service = module.get<CategoryAttributeValuesService>(CategoryAttributeValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
