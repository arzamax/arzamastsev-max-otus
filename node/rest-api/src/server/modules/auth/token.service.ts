import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Cache } from 'cache-manager';
import { addDays, differenceInSeconds, getUnixTime } from 'date-fns';

import { User, UserDocument } from '../user';

import { TOKEN_PREFIX } from './constants';
import { JwtPayloadModel } from './models';
import { AuthResponseDto } from './dto';

type AccessTokenData = {
  accessToken: string;
  jti: string;
  iat: number;
};

type AuthTokensData = {
  accessToken: string;
  refreshToken: string;
  iat: number;
};

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  private async generateAccessToken(email: string): Promise<AccessTokenData> {
    const jti = uuid();
    const accessToken = this.jwtService.sign({ email }, { jwtid: jti });
    const { iat, exp } = this.jwtService.decode(accessToken) as JwtPayloadModel;
    const ttl = exp - iat;

    await this.cacheManager.set(
      `${TOKEN_PREFIX.accessToken}${jti}`,
      accessToken,
      { ttl }
    );

    return {
      accessToken,
      iat,
      jti,
    };
  }

  private async generateRefreshToken(jti: string): Promise<string> {
    const refreshToken = uuid();
    const now = new Date();

    await this.cacheManager.set(
      `${TOKEN_PREFIX.refreshToken}${jti}`,
      refreshToken,
      { ttl: differenceInSeconds(addDays(now, 7), now) }
    );

    return refreshToken;
  }

  public async createAuthTokens(email: string): Promise<AuthTokensData> {
    const { accessToken, iat, jti } = await this.generateAccessToken(email);
    const refreshToken = await this.generateRefreshToken(jti);

    return {
      accessToken,
      refreshToken,
      iat,
    };
  }

  public async deleteAuthTokens(jti: string) {
    await this.cacheManager.del(`${TOKEN_PREFIX.accessToken}${jti}`);
    await this.cacheManager.del(`${TOKEN_PREFIX.refreshToken}${jti}`);
  }

  public async updateAuthTokens(
    prevRefreshToken: string,
    prevAccessToken?: string
  ): Promise<AuthResponseDto> {
    if (!prevAccessToken) {
      throw new UnauthorizedException();
    }

    const decodedAccessToken = this.jwtService.decode(
      prevAccessToken
    ) as JwtPayloadModel | null;

    if (!decodedAccessToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel.findOne({
      email: decodedAccessToken.email,
      isBlocked: false,
      isInvalidated: false,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.validatedAt) {
      const validatedAt = getUnixTime(user.validatedAt);

      if (validatedAt > decodedAccessToken.iat) {
        throw new UnauthorizedException();
      }
    }

    const refreshToken = await this.cacheManager.get(
      `${TOKEN_PREFIX.refreshToken}${decodedAccessToken.jti}`
    );

    if (refreshToken !== prevRefreshToken) {
      throw new UnauthorizedException();
    }

    const { accessToken: updatedAccessToken, jti } =
      await this.generateAccessToken(decodedAccessToken.email);
    const updatedRefreshToken = await this.generateRefreshToken(jti);

    await this.deleteAuthTokens(decodedAccessToken.jti);

    return {
      accessToken: updatedAccessToken,
      refreshToken: updatedRefreshToken,
    };
  }
}
