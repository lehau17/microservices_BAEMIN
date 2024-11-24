import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('registerUser')
  register(@Payload() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @MessagePattern('loginUser')
  login(@Payload() payload: LoginDto) {
    return this.userService.login(payload);
  }

  @MessagePattern('validateUser')
  validateUser(
    @Payload() { username, password }: { username: string; password: string },
  ) {
    return this.userService.validateUser(username, password);
  }

  @MessagePattern('findAllUser')
  findAll() {
    return this.userService.findAll();
  }

  @EventPattern('addRefreshToken')
  updateRefresTOken(@Payload() payload: { id: number; refreshToken: string }) {
    return this.userService.updateRefreshToken(
      payload.id,
      payload.refreshToken,
    );
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('updateUser')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: number) {
    return this.userService.remove(id);
  }
}
