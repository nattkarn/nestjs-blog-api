import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    const { content, postId } = createCommentDto;

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { id: userId } },
      },
      include: { author: true, post: true },
    });
  }

  // ฟังก์ชันดึงความคิดเห็นทั้งหมดของโพสต์
  async getCommentsByPost(postId: number) {
    // ตรวจสอบว่าโพสต์มีอยู่จริงหรือไม่
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.prisma.comment.findMany({
      where: { postId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ฟังก์ชันอัปเดตความคิดเห็น
  async updateComment(id: number, updateCommentDto: Partial<CreateCommentDto>, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedException('You can only update your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: { author: true, post: true },
    });
  }

  // ฟังก์ชันลบความคิดเห็น
  async deleteComment(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new UnauthorizedException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: { id },
      include: { author: true, post: true },
    });
  }
}
