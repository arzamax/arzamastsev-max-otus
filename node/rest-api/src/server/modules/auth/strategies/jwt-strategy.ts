import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { getUnixTime } from 'date-fns';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';

import { User, UserDocument } from '../../user';
import { JwtPayloadModel } from '../models';
import { TOKEN_PREFIX } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadModel): Promise<JwtPayloadModel> {
    const user = await this.userModel.findOne({
      email: payload.email,
      isBlocked: false,
      isInvalidated: false,
    });

    if (
      !user ||
      !(await this.cacheManager.get(
        `${TOKEN_PREFIX.accessToken}${payload.jti}`
      ))
    ) {
      throw new UnauthorizedException();
    }

    if (user.validatedAt) {
      const validatedAt = getUnixTime(user.validatedAt);

      if (validatedAt > payload.iat) {
        throw new UnauthorizedException();
      }
    }

    return payload;
  }
}
