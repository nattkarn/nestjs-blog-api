import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostsDto } from './dto/search-posts.dto';

@Controller('/api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Successfully created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  @ApiTags('Tasks')
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    const userId = Number(req['user']?.['userId']);
    console.log('User ID:', userId);
    return this.postsService.create(createPostDto, userId);
  }

  @Get('/:id/')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a post by Id' })
  @ApiResponse({ status: 201, description: 'Successfully get' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }



  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 201, description: 'Successfully get' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  updatePost(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    const userId = Number(req['user']?.['userId']);
    const userRole = String(req['user']?.['role']);

    if (userRole.toLowerCase() !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 201, description: 'Successfully Delete' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  Delete(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const userId = Number(req['user']?.['userId']);
    const userRole = String(req['user']?.['role']);

    if (userRole.toLowerCase() !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    return this.postsService.deletePost(id);
  }

  @Get()
  async search(@Query() searchPostsDto: SearchPostsDto) {
    const { query, categoryId, tagId, page = 1, limit = 10 } = searchPostsDto;
    return this.postsService.searchPosts({
      query,
      categoryId: categoryId ? +categoryId : undefined,
      tagId: tagId ? +tagId : undefined,
      page: +page,
      limit: +limit,
    });
  }
}
