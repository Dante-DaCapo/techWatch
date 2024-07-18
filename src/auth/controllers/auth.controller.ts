import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignInDto } from "../DTOs/signInDto";
import { AccessTokenGuard, RefreshTokenGuard } from "../guards/auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(
    @Body(new ValidationPipe()) signInDto: SignInDto
  ): Promise<{ refresh_token: string }> {
    const refreshToken = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
      signInDto.rememberMe
    );
    return refreshToken;
  }

  @UseGuards(RefreshTokenGuard)
  @Post("/get-access-token")
  async getAccessToken(@Req() request: Request) {
    // TODO refaire toute la gestion des RefreshToken
    const user = request["user"];
    const newAccessToken = await this.authService.refreshAccessToken(1, user);
    return { access_token: newAccessToken };
  }

  @UseGuards(AccessTokenGuard)
  @Get("/logout")
  logout(@Req() request: Request) {
    const userId: number = request["user"].id;
    if (!userId) {
      throw new Error("Cannot logout: no userId provided");
    }
    return this.authService.logout(userId);
  }
}
