import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddCartItemDto } from './dto/add-items.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/common/demos/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post('/add-items')
  @Roles(['USER', 'ADMIN'])
  @UseGuards(AccessTokenGuard, RolesGuard)
  create(@Body() body: AddCartItemDto, @Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;
    return this.cartsService.create(body, sub);
  }

  @Patch(':id')
  @Roles(['USER', 'ADMIN'])
  @UseGuards(AccessTokenGuard, RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: Express.Request,
  ) {
    const { sub } = req.user as TokenPayload;
    return this.cartsService.update(+id, updateCartDto, sub);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;

    return this.cartsService.remove(+id, sub);
  }

  @Get('/me')
  @UseGuards(AccessTokenGuard)
  getMyCart(@Req() req: Express.Request) {
    const { sub } = req.user as TokenPayload;
    return this.cartsService.getCart(sub);
  }

  @Get('/:user_id')
  @Roles(['ADMIN', 'SUPERADMIN'])
  @UseGuards(AccessTokenGuard, RolesGuard)
  geCartsForUser(@Param('user_id') user_id: string) {
    return this.cartsService.getCart(+user_id);
  }
}
