import { FetchUrlService } from "../contracts/FetchUrlService";

export class TestFetchUrlService implements FetchUrlService {
  constructor() {}

  async getPageFromUrl(
    url: string,
  ): Promise<{ description: string; title: string; imageUrl: string }> {
    return {
      title: "test title",
      description: "testDescription",
      imageUrl: url + "/image",
    };
  }
}
