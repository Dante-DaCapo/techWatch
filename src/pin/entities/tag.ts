import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Pin } from "./pin";
import { User } from "src/users/entities/user.entity";
import { TagDto } from "../dto/TagDto";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Pin, (pin) => pin.tags, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  pins: Pin[];

  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  toDto(): TagDto {
    const tagDto = new TagDto();
    tagDto.id = this.id;
    tagDto.name = this.name;
    return tagDto;
  }
}
