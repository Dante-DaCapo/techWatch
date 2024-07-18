import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/services/users.service";
import * as bcrypt from "bcrypt";
import { AuthJwtPayload } from "../types/AuthJwtPayload";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private hashRounds = 10;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signIn(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<{ refresh_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // TODO protect this against timing attacks
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const refreshToken = await this.getRefreshToken(
      user.id,
      user.username,
      rememberMe
    );
    await this.updateRefreshToken(user.id, refreshToken);

    return { refresh_token: refreshToken };
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.update(userId, {
      refreshToken: null,
    });
  }

  async refreshAccessToken(
    userId: number,
    refreshToken: string
  ): Promise<string> {
    // Check user and refreshToken
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Access Denied");
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException("Access Denied");
    }

    // Check refresh token expiration
    try {
      await this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        throw new Error("Expired Token - Sign In to get a new one");
      }
    }

    // Generate new access_token
    return this.getAccessToken(user.id, user.username);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  private hashData(data: string) {
    return bcrypt.hash(data, this.hashRounds);
  }

  private async getAccessToken(userId: number, username: string) {
    const jwtPayload: AuthJwtPayload = {
      sub: userId,
      username: username,
    };
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
      expiresIn: "10s",
    });
  }

  private async getRefreshToken(
    userId: number,
    username: string,
    rememberMe: boolean
  ): Promise<string> {
    const refreshExpiresIn: string = rememberMe ? "30 days" : "1h";
    const jwtPayload: AuthJwtPayload = {
      sub: userId,
      username: username,
    };
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: refreshExpiresIn,
    });
  }
}
