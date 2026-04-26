import { Test, TestingModule } from '@nestjs/testing';
import { CategoryAttributeService } from './category_attribute.service';

describe('CategoryAttributeService', () => {
  let service: CategoryAttributeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryAttributeService],
    }).compile();

    service = module.get<CategoryAttributeService>(CategoryAttributeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
