import { Controller, Req, UseGuards, Get } from "@nestjs/common";
import { TagService } from "../services/tag.service";
import { AccessTokenGuard } from "src/auth/guards/auth.guard";
import { User } from "src/users/entities/user.entity";
import { Request } from "express";
import { TagDto } from "../dto/TagDto";

@Controller("tag")
@UseGuards(AccessTokenGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get("get-user-tags")
  getUserTags(@Req() request: Request): Promise<TagDto[]> {
    const user: User = request.user;
    return this.tagService
      .findAllByUser(user)
      .then((tags) => tags.map((tag) => tag.toDto()));
  }
}
