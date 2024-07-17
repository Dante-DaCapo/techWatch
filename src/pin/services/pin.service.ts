import { Inject, Injectable } from "@nestjs/common";
import { Pin } from "../entities/pin";
import { FetchUrlService } from "../contracts/FetchUrlService";
import { CreatePinDto } from "../dto/CreatePinDto";
import { User } from "src/users/entities/user.entity";
import { Tag } from "../entities/tag";
import {
  PIN_REPOSITORY,
  PinRepositoryPort,
} from "../database/pin.repository.port";

@Injectable()
export class PinService {
  constructor(
    @Inject(PIN_REPOSITORY)
    private readonly pinRepository: PinRepositoryPort,
    private readonly fetchUrlService: FetchUrlService
  ) {}

  findByIdAndUser(id: number, user: User): Promise<Pin> {
    return this.pinRepository.findOneByUserAndId(id, user);
  }

  findAllByUser(user: User): Promise<Pin[]> {
    return this.pinRepository.findAllByUser(user);
  }

  searchPins(search: string, user: User): Promise<Pin[]> {
    return this.pinRepository.searchByString(search, user);
  }

  async deleteByIdAndUser(id: number, user: User): Promise<void> {
    const pin: Pin = await this.findByIdAndUser(id, user);
    if (!pin) {
      throw new Error("Pin not found for user. Cannot perform delete");
    }
    return this.pinRepository.deleteById(pin.id);
  }

  createPin(createPinDto: CreatePinDto, user: User): Promise<Pin> {
    const pin = this.createPinFromDto(createPinDto, user);
    return this.pinRepository.persitsPin(pin);
  }

  extractDataFromUrl(
    url: string
  ): Promise<{ description: string; title: string; imageUrl: string }> {
    return this.fetchUrlService.getPageFromUrl(url);
  }

  createPinFromDto(createPinDto: CreatePinDto, user: User): Pin {
    const pin = new Pin();
    pin.title = createPinDto.title;
    pin.description = createPinDto.description;
    pin.imageUrl = createPinDto.imageUrl;
    pin.sourceUrl = createPinDto.sourceUrl;
    pin.searchString = `${createPinDto.title.toLowerCase()} ${createPinDto.description.toLowerCase()}`;
    pin.user = user;
    pin.tags = createPinDto.tags.map((tagName) => {
      const existingTag = user.tags?.find(
        (userTag) => userTag.name === tagName
      );
      if (existingTag) {
        return existingTag;
      } else {
        const newTag = new Tag();
        newTag.name = tagName;
        newTag.user = user;
        return newTag;
      }
    });
    return pin;
  }
}
