import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class JwtPayloadModel {
  @Expose()
  public readonly email!: string;

  public readonly iat!: number;

  public readonly exp!: number;

  public readonly jti!: string;
}
