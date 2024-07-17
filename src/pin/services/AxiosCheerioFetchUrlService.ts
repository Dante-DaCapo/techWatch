import axios from "axios";
import * as cheerio from "cheerio";
import { FetchUrlService } from "src/pin/contracts/FetchUrlService";

export class AxiosCheerioFetchUrlService implements FetchUrlService {
  constructor() {}

  async getPageFromUrl(
    url: string,
  ): Promise<{ description: string; title: string; imageUrl: string }> {
    const response = await axios({
      method: "get",
      url,
    });
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);
    const ogTitle: string = $('[property="og:title"]').attr("content") || "";
    const ogDescription: string =
      $('[property="og:description"]').attr("content") || "";
    const ogImage: string = $('[property="og:image"]').attr("content") || "";
    return {
      title: ogTitle,
      description: ogDescription,
      imageUrl: ogImage,
    };
  }
}
