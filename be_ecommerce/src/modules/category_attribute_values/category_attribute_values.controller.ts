import { Controller, UseGuards } from '@nestjs/common';
import { CategoryAttributeValuesService } from './category_attribute_values.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';

@Controller('category-attribute-values')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryAttributeValuesController {
  constructor(
    private readonly categoryAttributeValuesService: CategoryAttributeValuesService,
  ) {}
}
