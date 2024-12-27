import { roles } from './../../node_modules/.prisma/client/index.d';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';
import { users } from '@prisma/client';
import { createHmac } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDTO } from 'src/common/dto/response.dto';
import { TokenPayload } from 'src/common/dto/tokenPayload.jwt.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject('CART_SERVICE') private cartService: ClientProxy,
    @Inject('MAIL_SERVICE') private mailService: ClientProxy,
  ) {}
  create(createUserDto: CreateUserDto) {
    //check email
    return this.prisma.users.create({
      data: {
        ...createUserDto,
        usr_password: createHmac('sha256', createUserDto.usr_password).digest(
          'hex',
        ),
        role: {
          connect: {
            id: 1,
          },
        },
      },
    });
  }

  async login({ usr_password, usr_username }: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const foundUser = await this.validateUser(usr_username, usr_password);
    if (!foundUser || foundUser.status === 0) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User not found',
      });
    }

    const token = await this.getTokens(foundUser);
    return token;
  }

  async validateUser(username: string, password: string): Promise<UserDTO> {
    return this.prisma.users.findFirst({
      where: {
        usr_email: username,
        usr_password: createHmac('sha256', password).digest('hex'),
      },
      include: {
        role: true,
      },
    });
  }

  async getTokens(user: UserDTO): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.usr_email,
          avatar: user.usr_avatar,
          role: {
            id: user.role.id,
            role_name: user.role.role_name,
          },
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15d',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.usr_email,
          role: {
            id: user.role.id,
            role_name: user.role.role_name,
          },
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    //fimd by email
    const foundUser = await this.prisma.users.findFirst({
      where: {
        usr_email: createUserDto.usr_email,
      },
    });
    console.log(foundUser);
    if (foundUser && foundUser.usr_username === createUserDto.usr_username) {
      throw new RpcException({
        message: 'Email or username already exists',
        statusCode: 400, // Mã lỗi tùy chỉnh
      });
    }

    const newUser = await this.prisma.users.create({
      data: {
        ...createUserDto,
        usr_password: createHmac('sha256', createUserDto.usr_password).digest(
          'hex',
        ),
        role: {
          connect: {
            id: 1,
          },
        },
      },
    });
    // create cart
    this.cartService.emit('createCart', newUser.id).pipe();
    this.mailService.emit('sendMail', {
      to: newUser.usr_email,
      context: {
        name: newUser.usr_username,
        actionUrl: 'locahost:3000',
      },
      subject: 'Welcome to My E-Commerce',
      template: './welcome.hbs',
    });
    return newUser;
  }

  async decodeToken(token: string): Promise<TokenPayload> {
    const decode = this.jwtService
      .verifyAsync<TokenPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })
      .then((response) => {
        return response;
      })
      .catch(() => {
        throw new RpcException({ message: 'Unauthenticated', statusCode: 401 });
      });
    return decode;
  }

  async refreshToken(user_id: number, refreshToken: string) {
    const foundUser = await this.prisma.users.findFirst({
      where: {
        id: user_id,
      },
      include: {
        role: true,
      },
    });
    if (
      !foundUser ||
      foundUser.status == 0 ||
      foundUser.usr_refresh_token !== refreshToken
    ) {
      throw new RpcException({
        message: 'Unaithored',
        statusCode: 401,
      });
    }
    const payloadToken: TokenPayload = {
      sub: foundUser.id,
      role: {
        id: foundUser.role.id,
        role_name: foundUser.role.role_name,
      },
      username: foundUser.usr_email,
      iat: new Date().getTime(),
      exp: new Date().getTime(),
    };
    // const token = await this.getTokens();
  }

  updateRefreshToken(id: number, token: string) {
    return this.prisma.users.update({
      where: {
        id: id,
      },
      data: {
        usr_refresh_token: token,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return this.prisma.users.findFirst({ where: { id: id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
