import { Test, TestingModule } from "@nestjs/testing";
import { PinService } from "./pin.service";
import { Pin } from "../entities/pin";
import { FetchUrlService } from "../contracts/FetchUrlService";
import { TestFetchUrlService } from "../tests/TestFetchUrlService";
import { getRepositoryToken } from "@nestjs/typeorm";
import {
  PIN_REPOSITORY,
  PinRepositoryPort,
} from "../database/pin.repository.port";
import { TagService } from "./tag.service";
import { CreatePinDto } from "../dto/CreatePinDto";
import { User } from "src/users/entities/user.entity";
import { Tag } from "../entities/tag";

describe("PinService", () => {
  let service: PinService;
  const mockRepository: PinRepositoryPort = {
    findOneByUserAndId: jest.fn(),
    findOneByUserAndTag: jest.fn(),
    findAllByUser: jest.fn(),
    searchByString: jest.fn(),
    deleteById: jest.fn(),
    persitsPin: jest.fn(),
  };

  const mockTagService = {
    findAllByUser: jest.fn(),
    deleteTagById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PinService,
        { provide: TagService, useValue: mockTagService },
        { provide: PIN_REPOSITORY, useValue: mockRepository },
        // { provide: getRepositoryToken(Pin), useValue: mockRepository },
        { provide: FetchUrlService, useClass: TestFetchUrlService },
      ],
    }).compile();

    service = module.get<PinService>(PinService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return extractedData from url", async () => {
    const url = "https://www.google.com";
    const data = await service.extractDataFromUrl(url);
    expect(data).toEqual({
      title: "test title",
      description: "testDescription",
      imageUrl: url + "/image",
    });
  });

  describe("pin creation", () => {
    it("correct DTO", () => {
      const createPinDto: CreatePinDto = {
        title: "titre",
        description: "description",
        imageUrl: "url",
        sourceUrl: "url",
        tags: ["test", "test2"],
      };
      const user = { id: 0 };
      expect(service.createPinFromDto(createPinDto, user as User)).toEqual({
        title: "titre",
        description: "description",
        imageUrl: "url",
        sourceUrl: "url",
        tags: [
          { name: "test", user },
          { name: "test2", user },
        ],
        user,
        searchString: "titre description",
      });
    });
  });

  describe("pin deletion", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should throw if no pin at id", async () => {
      //service.findByIdAndUser(1, {} as User);
      const spy = jest
        .spyOn(service, "findByIdAndUser")
        .mockResolvedValue(undefined);

      await expect(
        service.deleteByIdAndUser(2, { id: 2 } as User)
      ).rejects.toThrow("Pin not found for user. Cannot perform delete");

      expect(spy).toHaveBeenCalled();
    });

    it("should delete pin but not tag if tag use elsewhere", async () => {
      const user = { id: 0 };
      const spyFindByIdAndUser = jest
        .spyOn(service, "findByIdAndUser")
        .mockResolvedValue({
          title: "titre",
          description: "description",
          imageUrl: "url",
          sourceUrl: "url",
          tags: [{ name: "test", user } as Tag, { name: "test2", user } as Tag],
          user,
          searchString: "titre description",
        } as Pin);

      const spyFindOneWithTag = jest
        .spyOn(mockRepository, "findOneByUserAndTag")
        .mockResolvedValue({ id: 1 } as Pin);

      const spyTagServiceDeleteTagById = jest.spyOn(
        mockTagService,
        "deleteTagById"
      );

      await service.deleteByIdAndUser(2, { id: 2 } as User);

      expect(spyFindByIdAndUser).toHaveBeenCalled();
      expect(spyTagServiceDeleteTagById).toHaveBeenCalledTimes(0);
      expect(spyFindOneWithTag).toHaveBeenCalledTimes(2);
    });

    it("should delete pin and tag if no where else present", async () => {
      const user = { id: 0 };
      const spyFindByIdAndUser = jest
        .spyOn(service, "findByIdAndUser")
        .mockResolvedValue({
          title: "titre",
          description: "description",
          imageUrl: "url",
          sourceUrl: "url",
          tags: [{ name: "test", user } as Tag, { name: "test2", user } as Tag],
          user,
          searchString: "titre description",
        } as Pin);

      const spyTagServiceDeleteTagById = jest.spyOn(
        mockTagService,
        "deleteTagById"
      );

      await service.deleteByIdAndUser(2, { id: 2 } as User);

      expect(spyFindByIdAndUser).toHaveBeenCalled();
      expect(spyTagServiceDeleteTagById).toHaveBeenCalledTimes(2);
    });
  });
});
