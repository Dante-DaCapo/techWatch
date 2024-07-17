import { Module } from "@nestjs/common";
import { PinController } from "./controllers/pin.controller";
import { PinService } from "./services/pin.service";
import { Pin } from "./entities/pin";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AxiosCheerioFetchUrlService } from "./services/AxiosCheerioFetchUrlService";
import { FetchUrlService } from "./contracts/FetchUrlService";
import { TestFetchUrlService } from "./tests/TestFetchUrlService";
import { ConfigService } from "@nestjs/config";
import { Tag } from "./entities/tag";
import { TagService } from "./services/tag.service";
import { PIN_REPOSITORY } from "./database/pin.repository.port";
import { PinRepository } from "./database/pin.repository";
import { TagController } from "./controllers/tag.controller";

const fetchUrlServiceProvider = {
  provide: FetchUrlService,
  useFactory: (configService: ConfigService) => {
    const environment = configService.get<string>("NODE_ENV");
    return environment === "development" || environment === "production"
      ? new AxiosCheerioFetchUrlService()
      : new TestFetchUrlService();
  },
  inject: [ConfigService],
};

const databaseRepositoryProvider = {
  provide: PIN_REPOSITORY,
  useClass: PinRepository,
};

@Module({
  imports: [TypeOrmModule.forFeature([Pin, Tag])],
  controllers: [PinController, TagController],
  providers: [
    PinService,
    fetchUrlServiceProvider,
    TagService,
    databaseRepositoryProvider,
  ],
})
export class PinModule {}
