import { FileCacheService } from "./file-cache.service";
import { InFlightRequestService } from "./in-flight-request.service";
import { ContentService } from "./content.service";
import type { FileCacheService as FileCacheServiceImpl } from "./file-cache.service";
import type { InFlightRequestService as InFlightRequestServiceImpl } from "./in-flight-request.service";
import type { ContentResponse } from "@/src/types";

class PartnersPageService {
  constructor(
    private readonly fileCache: FileCacheServiceImpl,
    private readonly inFlightRequest: InFlightRequestServiceImpl,
  ) {}

  isNotPageCheck(pathFromBody: string) {
    if (!pathFromBody) {
      return false;
    }
    const parts = pathFromBody.split("/");
    return /\./.test(parts[parts.length - 1]);
  }

  async fetch(pathFromBody: string): Promise<ContentResponse> {
    console.log(33333);
    const cachedResult = await this.fileCache.get(pathFromBody);
    console.log(1111111);
    if (cachedResult) {
      console.log(222222);
      this.inFlightRequest.fetch(pathFromBody, cachedResult); // @IMPORTANT: No await!
      console.log(cachedResult.headerNavbar);
      return cachedResult;
    }
    return await this.inFlightRequest.fetch(pathFromBody);
  }
}

const globalForServices = globalThis as typeof globalThis & {
  partnerPageService?: PartnersPageService;
};

// singleton
export const partnersPageService =
  globalForServices.partnerPageService ??
  (() => {
    const cacheService = new FileCacheService();
    const contentService = new ContentService();
    const inFlightRequestService = new InFlightRequestService(cacheService, contentService);
    const service = new PartnersPageService(cacheService, inFlightRequestService);

    globalForServices.partnerPageService = service;
    return service;
  })();
