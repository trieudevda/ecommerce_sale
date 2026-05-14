import { plainToInstance, Transform } from "class-transformer";
import { IsNumber, IsString, IsOptional } from "class-validator";
import { ProductVariantRelationDto } from "src/modules/product_variant/dto/category-relation";
import { ProductVariant } from "src/modules/product_variant/entities/product_variant.entity";
// import { IsOptional } from "class-validator/types/decorator/common/IsOptional";

export class CreatePriceHistoryDto {
    @IsOptional()
    id?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const parsed = JSON.parse(value);
            return plainToInstance(ProductVariantRelationDto, parsed);
        }
        return plainToInstance(ProductVariantRelationDto, value);
    })
    variant: ProductVariantRelationDto;

    @IsNumber()
    @Transform(({ value }) => Number(value))
    price?: number;

    @IsOptional()
    startDate?: Date;

    @IsOptional()
    endDate?: Date;
}
