import { User } from "src/users/entities/user.entity";
import { Pin } from "../entities/pin";

export interface PinRepositoryPort {
  findOneByUserAndId(id: number, user: User): Promise<Pin>;
  findAllByUser(user: User): Promise<Pin[]>;
  searchByString(search: string, user: User): Promise<Pin[]>;
  deleteById(id: number): Promise<void>;
  persitsPin(pin: Pin): Promise<Pin>;
}

export const PIN_REPOSITORY = Symbol("PIN_REPOSITORY");
