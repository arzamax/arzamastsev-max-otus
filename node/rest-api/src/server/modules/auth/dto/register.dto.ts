import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  public readonly email!: string;

  @IsNotEmpty()
  @MaxLength(255)
  public readonly firstName!: string;

  @IsNotEmpty()
  @MaxLength(100)
  public readonly lastName!: string;
}
