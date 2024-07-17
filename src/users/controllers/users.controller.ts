import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "../dto/createUser.dto";
import { UsersService } from "../services/users.service";
import { AccessTokenGuard } from "src/auth/guards/auth.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("create-user")
  async createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  async getConnectedUser(@Param("id") id: number) {
    await this.usersService.findById(id);
  }
}
