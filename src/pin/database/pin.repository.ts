import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Pin } from "../entities/pin";
import { Injectable } from "@nestjs/common";
import { PinRepositoryPort } from "./pin.repository.port";
import { User } from "src/users/entities/user.entity";

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

  deleteById(id: number): Promise<void> {
    this.pinTypeOrmRepository.delete(id);
    return;
  }

  persitsPin(pin: Pin): Promise<Pin> {
    return this.pinTypeOrmRepository.save(pin);
  }
}
