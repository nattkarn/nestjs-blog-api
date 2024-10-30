// src/posts/dto/search-posts.dto.ts

import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPostsDto {
  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  tagId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;
}
