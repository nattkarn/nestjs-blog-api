import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma/prisma.service';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }) ,UsersModule, AuthModule, PrismaModule, PostsModule, CategoriesModule, TagsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, PrismaService]
})
export class AppModule {}
 