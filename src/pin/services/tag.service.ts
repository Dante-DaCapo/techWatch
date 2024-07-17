import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tag } from "../entities/tag";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>
  ) {}

  findAllByUser(user: User): Promise<Tag[]> {
    return this.tagRepository.findBy({ user });
  }
}
