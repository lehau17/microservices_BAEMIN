import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { FindVoucherDto } from './dto/find-vopucher.dto';
import { Roles } from 'src/common/demos/roles.decorator';
import ROLE from 'src/common/enums/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @Roles([ROLE.SHOP, ROLE.ADMIN])
  @UseGuards(AccessTokenGuard, RolesGuard)
  create(
    @Body() createVoucherDto: CreateVoucherDto,
    @Req() req: Express.Request,
  ) {
    const { sub } = req.user as TokenPayload;
    return this.vouchersService.create(createVoucherDto, sub);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll(@Query() paging: FindVoucherDto) {
    return this.vouchersService.findAll(paging);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.vouchersService.update(+id, updateVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(+id);
  }
}
