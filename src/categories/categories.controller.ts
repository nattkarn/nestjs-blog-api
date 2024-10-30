import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  @ApiTags('Tasks')
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  @ApiTags('Tasks')
  async findById(@Param('id') id: string) {
    const categoryId = Number(id);
    return this.categoriesService.getCategoryById(categoryId);
  }

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
  create(@Req() req, @Body() createCategoryDto: CreateCategoryDto) {
    const userRole = String(req['user']?.['role']);
    console.log(userRole);
    if (userRole.toLowerCase() !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Successfully updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  @ApiTags('Tasks')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const userRole = String(req['user']?.['role']);
    if (userRole.toLowerCase() !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    return this.categoriesService.updateCategory(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth('access-token') // Specify that this route requires Bearer Token authentication
  @ApiTags('Tasks')
  async remove(@Req() req, @Param('id') id: string) {
    const userRole = String(req['user']?.['role']);
    if (userRole.toLowerCase() !== 'admin') {
      throw new UnauthorizedException(
        'You are not authorized to access this resource',
      );
    }
    return this.categoriesService.deleteCategory(+id);
  }
}
