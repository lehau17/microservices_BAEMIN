import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Roles } from 'src/common/demos/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ChangeStateOrderDto } from './dto/change-state-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  async create(@Body() data: CreateOrderDto, @Req() req) {
    return this.ordersService.create(data, req.user.sub, req.user.username);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll(@Req() req) {
    return this.ordersService.findAll(req.user.sub);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req,
  ) {
    return this.ordersService.update(+id, req.user.sub, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.ordersService.remove(+id, req.user.sub);
  }

  @Patch(':id/change-state')
  @Roles(['ADMIN', 'SHOP', 'SUPER_ADMIN'])
  @UseGuards(AccessTokenGuard, RolesGuard)
  changeState(
    @Param('id') id: string,
    @Body() updateOrderDto: ChangeStateOrderDto,
    @Req() req,
  ) {
    return this.ordersService.changeState(+id, req.user.sub, updateOrderDto);
  }
}
