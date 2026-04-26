import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryAttributeValueDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
