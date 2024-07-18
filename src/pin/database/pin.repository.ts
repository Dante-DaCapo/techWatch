import { InjectRepository } from "@nestjs/typeorm";
import { In, Like, Repository } from "typeorm";
import { Pin } from "../entities/pin";
import { Injectable } from "@nestjs/common";
import { PinRepositoryPort } from "./pin.repository.port";
import { User } from "src/users/entities/user.entity";
import { Tag } from "../entities/tag";

@Injectable()
export class PinRepository implements PinRepositoryPort {
  constructor(
    @InjectRepository(Pin)
    private readonly pinTypeOrmRepository: Repository<Pin>
  ) {}

  findOneByUserAndId(id: number, user: User): Promise<Pin> {
    return this.pinTypeOrmRepository.findOneBy({ id, user });
  }

  findAllByUser(user: User): Promise<Pin[]> {
    return this.pinTypeOrmRepository.findBy({ user });
  }

  searchByString(search: string, user: User): Promise<Pin[]> {
    return this.pinTypeOrmRepository.findBy({
      user,
      searchString: Like(`%${search}%`),
    });
  }

  findOneByUserAndTag(user: User, tag: Tag): Promise<Pin | undefined> {
    return this.pinTypeOrmRepository.findOneBy({
      user,
      tags: tag,
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.pinTypeOrmRepository.delete(id);
  }

  persitsPin(pin: Pin): Promise<Pin> {
    return this.pinTypeOrmRepository.save(pin);
  }
}
