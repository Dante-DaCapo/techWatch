import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/createUser.dto";
import * as bcrypt from "bcrypt";
import { TypeOrmSQLITETestingModule } from "src/database/typeOrmSqliteTest.module";
import { getConnection } from "typeorm";
import { Tag } from "src/pin/entities/tag";
import { Pin } from "src/pin/entities/pin";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmSQLITETestingModule([User, Tag, Pin])],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create user correctly", async () => {
    const createUserDto: CreateUserDto = new CreateUserDto();
    createUserDto.email = "test@email.com";
    createUserDto.username = "Test";
    createUserDto.password = "SuperSecret1234#!";

    const user = await service.create(createUserDto);
    expect(user).toBeDefined();
    expect(user.email).toEqual(createUserDto.email);
    expect(user.username).toEqual(createUserDto.username);
    expect(user.isActive).toEqual(true);
    const passwordMatching = await bcrypt.compare(
      createUserDto.password,
      user.password
    );
    expect(passwordMatching).toEqual(true);
  });

  describe("should delete user correctly", () => {
    let user;
    beforeAll(async () => {
      const createUserDto: CreateUserDto = new CreateUserDto();
      createUserDto.email = "test2@email.com";
      createUserDto.username = "Test@";
      createUserDto.password = "SuperSecret1234#!";

      user = await service.create(createUserDto);
    });

    it("delete user", async () => {
      expect(user).toBeDefined();
      const userId = user.id;
      await service.delete(userId);
      user = await service.findById(userId);
      expect(user).toBeNull();
    });
  });
});
