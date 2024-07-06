import { Module } from '@nestjs/common';
import { LetterCategoryService } from './letter-category.service';
import { LetterCategoryController } from './letter-category.controller';

@Module({
  providers: [LetterCategoryService],
  controllers: [LetterCategoryController],
})
export class LetterCategoryModule {}
