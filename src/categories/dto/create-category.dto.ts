
import {
    IsString,
    IsBoolean,
    IsOptional,
    IsArray,
    ArrayUnique,
    IsInt,
    ArrayNotEmpty,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';


export class CreateCategoryDto {


    @IsString()
    readonly name: string

}
