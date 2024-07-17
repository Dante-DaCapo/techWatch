import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { PinService } from "../services/pin.service";
import { UrlDto } from "../dto/UrlDto";
import { CreatePinDto } from "../dto/CreatePinDto";
import { Request } from "express";
import { AccessTokenGuard } from "src/auth/guards/auth.guard";
import { User } from "src/users/entities/user.entity";
import { PinDto } from "../dto/PinDto";

@Controller("pin")
@UseGuards(AccessTokenGuard)
export class PinController {
  constructor(private readonly pinService: PinService) {}

  @Post("create-pin")
  createPin(
    @Body(new ValidationPipe()) createPinDto: CreatePinDto,
    @Req() request: Request
  ): Promise<PinDto> {
    const user: User = request.user;
    return this.pinService
      .createPin(createPinDto, user)
      .then((pin) => pin.toDto());
  }

  @Get("get-all-user-pins")
  getAllUserPins(@Req() request: Request): Promise<PinDto[]> {
    const user: User = request["user"];
    return this.pinService
      .findAllByUser(user)
      .then((pins) => pins.map((pin) => pin.toDto()));
  }

  @Get("search-pin")
  searchPin(
    @Query("q") search: string,
    @Req() request: Request
  ): Promise<PinDto[]> {
    const user: User = request["user"];
    return this.pinService
      .searchPins(search, user)
      .then((pins) => pins.map((pin) => pin.toDto()));
  }

  @Post("extract-data-from-url")
  extractDataFromUrl(
    @Body(new ValidationPipe()) urlDto: UrlDto
  ): Promise<{ description: string; title: string; imageUrl: string }> {
    return this.pinService.extractDataFromUrl(urlDto.url);
  }

  @Get(":id")
  getPinById(
    @Param("id") id: number,
    @Req() request: Request
  ): Promise<PinDto> {
    const user = request["user"];
    return this.pinService.findByIdAndUser(id, user).then((pin) => pin.toDto());
  }

  @Delete(":id")
  deletePinById(
    @Param("id") id: number,
    @Req() request: Request
  ): Promise<void> {
    const user: User = request["user"];
    return this.pinService.deleteByIdAndUser(id, user);
  }
}
