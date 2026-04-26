import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributeValuesService } from './product_attribute_values.service';

describe('ProductAttributeValuesService', () => {
  let service: ProductAttributeValuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductAttributeValuesService],
    }).compile();

    service = module.get<ProductAttributeValuesService>(ProductAttributeValuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
