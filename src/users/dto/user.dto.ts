import { IsEmail, IsNumber, IsString } from "class-validator";

export class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  username: string;

  @IsEmail()
  email: string;
}
