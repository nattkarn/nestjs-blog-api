// src/posts/dto/create-post.dto.ts

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

export class CreatePostDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsOptional()
  @IsBoolean()
  readonly published?: boolean;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayUnique()
  readonly categoryIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayUnique()
  readonly tagIds?: number[];
}
