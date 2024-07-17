import { IsOptional } from "class-validator";
import { Pin } from "src/pin/entities/pin";
import { Tag } from "src/pin/entities/tag";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @IsOptional()
  refreshToken: string;

  @OneToMany(() => Tag, (tag) => tag.user, { eager: true })
  tags: Tag[];

  @OneToMany(() => Pin, (pin) => pin.user)
  pins: Pin[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
