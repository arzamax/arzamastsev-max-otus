import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  public readonly email!: string;

  @Expose()
  @IsNotEmpty()
  @MaxLength(255)
  public readonly password!: string;
}
