import { fetchDato } from "@/src/lib/api/dato-cms";
import { logger } from "@/src/lib/api/logger";
import type { CmsData } from "@/src/types";

class HeadlessCmsService {
  private readonly defaultValue: CmsData = {
    client: {
      headerGreyText: `
        ООО &#34;АБ Маркет&#34;{" "}
        <strong>является официальным дистрибьютором по коммерческим ковровым покрытиям фабрики </strong>{" "}
        <Link href="https://nevatuft.ru/" className={"text-inherit! border-b-0! !underline"} target={"_blank"}>
          &#34;Нева Тафт&#34;
        </Link>{" "}
        - крупнейшего производителя ковровых покрытий в ЕАЭС
      `,
    },
    api: {
      routesMap: [],
    },
  };

  private data: CmsData;
  private isInitialized = false;

  constructor() {
    this.data = { ...this.defaultValue };
  }

  private async load(): Promise<CmsData> {
    try {
      const fetchResult = await fetchDato<{ config: CmsData }>(`
        query {
          config {
            client {
              headerGreyText
            }
          }
        }
      `);
      if (!fetchResult.config) {
        throw new Error("No config provided");
      }
      return fetchResult.config;
    } catch (error) {
      logger.error("Dato CMS fetch error", error);
      return this.data || this.defaultValue;
    }
  }

  async get(): Promise<CmsData> {
    if (this.isInitialized) return this.data;
    return this.load()
      .then((data) => {
        this.isInitialized = true;
        this.data = data;
        return data;
      })
      .catch((error) => {
        logger.error("Dato CMS fetch error", error);
        throw error;
      });
  }

  async refresh(): Promise<CmsData> {
    const fresh = await this.load();
    this.data = fresh;
    return fresh;
  }
}

export const headlessCms = new HeadlessCmsService();
