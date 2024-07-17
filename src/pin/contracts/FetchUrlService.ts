export abstract class FetchUrlService {
  abstract getPageFromUrl(
    url: string,
  ): Promise<{ description: string; title: string; imageUrl: string }>;
}
