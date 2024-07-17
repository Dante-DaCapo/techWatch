import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/services/users.service";
import { AuthJwtPayload } from "../types/AuthJwtPayload";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("JWT_ACCESS_SECRET"),
    });
  }

  async validate(payload: AuthJwtPayload): Promise<User> {
    const user: User = await this.userService.findById(Number(payload.sub));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
