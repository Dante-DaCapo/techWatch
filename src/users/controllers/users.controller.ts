import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "../dto/createUser.dto";
import { UsersService } from "../services/users.service";
import { AccessTokenGuard } from "src/auth/guards/auth.guard";
import { User } from "../entities/user.entity";
import { UserDto } from "../dto/user.dto";
import { Request } from "express";
import { UpdatePasswordDto } from "../dto/updatePasswordDto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create-user")
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get("/connected-user")
  async getConnectedUser(@Req() request: Request): Promise<UserDto> {
    const user: User = request.user;
    return user.toDto();
  }

  @UseGuards(AccessTokenGuard)
  @Delete("/connected-user")
  async deletedConnectedUser(@Req() request: Request) {
    const user: User = request.user;
    await this.usersService.delete(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Post("/update-password")
  updatePassword(
    @Body(new ValidationPipe()) updatePasswordDto: UpdatePasswordDto,
    @Req() request: Request
  ) {
    const user = request["user"];
    return this.usersService.updatePassword(updatePasswordDto, user);
  }
}
