import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService
  ) {}



  async createCategory(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create(
      {
        data: createCategoryDto
      }
    );
  }


  async findAll() {
    return this.prisma.category.findMany();
  }

  async getCategoryById(id: number) {
    return this.prisma.category.findUnique({
      where: { id }
    });
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto
    });
  }

  async deleteCategory(id: number) {
    await this.prisma.category.delete({
      where: { id }
    });

    return {
      status: 'success',
      message: 'Category deleted successfully',
    }
  }
}

