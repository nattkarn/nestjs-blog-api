import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const { title, content, published, categoryIds, tagIds } = createPostDto;
    return this.prisma.post.create({
      data: {
        title,
        content,
        published: published ?? false,
        author: { connect: { id: userId } },
        categories: categoryIds
          ? {
              connect: categoryIds.map((id) => ({ id })),
            }
          : undefined,
        tags: tagIds
          ? {
              connect: tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        categories: true,
        tags: true,
      },
    });
  }
  }

