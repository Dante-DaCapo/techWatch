import { Test, TestingModule } from "@nestjs/testing";
import { PinService } from "./pin.service";
import { Pin } from "../entities/pin";
import { FetchUrlService } from "../contracts/FetchUrlService";
import { TestFetchUrlService } from "../tests/TestFetchUrlService";
import { getRepositoryToken } from "@nestjs/typeorm";

describe("PinService", () => {
  let service: PinService;
  let mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PinService,
        { provide: getRepositoryToken(Pin), useValue: mockRepository },
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
});
