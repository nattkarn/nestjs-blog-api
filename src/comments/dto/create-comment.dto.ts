// src/comments/dto/create-comment.dto.ts

import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'เนื้อหาของความคิดเห็น',
    example: 'โพสต์นี้มีประโยชน์มากครับ ขอบคุณสำหรับข้อมูล!',
  })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({
    description: 'ID ของโพสต์ที่ต้องการแสดงความคิดเห็น',
    example: 1,
  })
  @IsInt()
  readonly postId: number;
}
