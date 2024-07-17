import { Exclude } from "class-transformer";
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tag } from "./tag";
import { User } from "src/users/entities/user.entity";
import { PinDto } from "../dto/PinDto";

@Entity()
export class Pin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  sourceUrl: string;

  @ManyToOne(() => User, (user) => user.pins)
  user: User;

  @Column()
  @Exclude()
  searchString: string;

  @ManyToMany(() => Tag, (tag) => tag.pins, {
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  tags: Tag[];

  toDto(): PinDto {
    const pinDto = new PinDto();
    pinDto.id = this.id;
    pinDto.title = this.title;
    pinDto.description = this.description;
    pinDto.imageUrl = this.imageUrl;
    pinDto.sourceUrl = this.sourceUrl;
    pinDto.tags = this.tags.map((tag) => tag.name);
    return pinDto;
  }
}
