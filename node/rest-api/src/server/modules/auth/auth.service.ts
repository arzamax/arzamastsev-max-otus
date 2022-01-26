import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { fromUnixTime } from 'date-fns';
import bcrypt from 'bcrypt';

import { User, UserDocument } from '../user';

import { AuthResponseDto, LoginDto, RegisterDto } from './dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly tokenService: TokenService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email } = registerDto;

    if (await this.userModel.findOne({ email })) {
      throw new BadRequestException('User already exists');
    }

    const user = new this.userModel(registerDto);
    await user.save();
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken, iat } =
      await this.tokenService.createAuthTokens(email);

    if (user.isInvalidated) {
      await this.userModel.updateOne(
        { email },
        { isInvalidated: false, validatedAt: fromUnixTime(iat) }
      );
    }

    return {
      accessToken,
      refreshToken,
    };
  }
}
