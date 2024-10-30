import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { create } from 'domain';
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  @ApiTags('Tasks')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    
    const userRole = String(req['user']?.['role']);
    const userId = Number(req['user']?.['userId']);

    if (userRole.toLowerCase() !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    // console.log(createCommentDto);
    return this.commentsService.createComment(createCommentDto, userId);
  }

  @ApiOperation({ summary: 'ดึงความคิดเห็นทั้งหมดของโพสต์' })
  @ApiResponse({ status: 200, description: 'คืนค่าข้อมูลความคิดเห็นทั้งหมดของโพสต์.' })
  @Get(':postId')
  async findAllByPost(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPost(+postId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'อัปเดตความคิดเห็น' })
  @ApiResponse({ status: 200, description: 'ความคิดเห็นถูกอัปเดตเรียบร้อยแล้ว.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: Partial<CreateCommentDto>, // สามารถใช้ DTO อื่นได้หากมี
    @Req() req: Request,
  ) {
    const userId = Number(req['user']?.['userId']);
    return this.commentsService.updateComment(+id, updateCommentDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลบความคิดเห็น' })
  @ApiResponse({ status: 200, description: 'ความคิดเห็นถูกลบเรียบร้อยแล้ว.' })
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = Number(req['user']?.['userId']);
    return this.commentsService.deleteComment(+id, userId);
  }
}
