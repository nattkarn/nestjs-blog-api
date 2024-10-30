import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { SearchPostsDto } from './dto/search-posts.dto';
import { Prisma } from '@prisma/client'; // เพิ่มการ import Prisma
@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

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

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        categories: true,
        tags: true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      include: {
        categories: true,
        tags: true,
      },
    });
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,

      
    });
  }

  async deletePost(id: number) {
    await this.prisma.post.delete({ where: { id } });
    return { status: 'success',
      message: 'Post deleted successfully',
     };
  }

  // ฟังก์ชันค้นหาโพสต์
  async searchPosts(searchPostsDto: SearchPostsDto) {
    const { query, categoryId, tagId, page, limit } = searchPostsDto;
    const skip = (page - 1) * limit;

    // สร้างเงื่อนไขการค้นหา
    const where: Prisma.PostWhereInput = {
      AND: [
        query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { tags: { some: { name: { contains: query, mode: 'insensitive' } } } },
              ],
            }
          : {},
        categoryId
          ? {
              categories: { some: { id: categoryId } },
            }
          : {},
        tagId
          ? {
              tags: { some: { id: tagId } },
            }
          : {},
      ],
    };

    // ดึงโพสต์ที่ตรงกับเงื่อนไขและนับจำนวนทั้งหมด
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: true,
          categories: true,
          tags: true,
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    // คำนวณจำนวนหน้าทั้งหมด
    const pages = Math.ceil(total / limit);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        pages,
      },
    };
  }
}
