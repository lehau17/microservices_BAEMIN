import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodLikeDto } from './create-food_like.dto';

export class UpdateFoodLikeDto extends PartialType(CreateFoodLikeDto) {}
