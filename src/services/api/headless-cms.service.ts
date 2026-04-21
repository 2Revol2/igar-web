import { fetchDato } from "@/src/lib/api/dato-cms";
import { logger } from "@/src/lib/api/logger";
import type { CmsData, PublicCmsData } from "@/src/types";

class HeadlessCmsService {
  private readonly defaultValue: CmsData = {
    contact: {
      person: "Директор Працкевич Игорь Вячеславович",
      address: "Республика Беларусь, Центральный район, г. Минск, ул. Тимирязева, дом 97, каб. 22-148",
      phone: "+375296038038",
      email: "abmarketbel@gmail.com",
      unp: "193659113",
      bank: '"Приорбанк" ОАО г. Минск, ул. .Хоружей, 31 А',
      bankBic: "PJCBBY2X",
    },
    content: {
      headerGreyText: `
        <p><span>ООО "АБ Маркет"&nbsp;<strong>является официальным дистрибьютором по коммерческим ковровым покрытиям </strong></span></p>
        <p><span><strong>фабрики </strong><a class="text-inherit! border-b-0! !underline" target="_blank" href="https://nevatuft.ru/" rel="noopener">"Нева Тафт"</a>&nbsp;- крупнейшего производителя ковровых покрытий в ЕАЭС,</span></p>
        <p><span>а также <strong>партнером</strong>&nbsp;<a class="text-inherit!  border-b-0! !underline" target="_blank" href="https://velvet-pro.ru/" rel="noopener">ООО "Вельвет Про"</a>&nbsp;- ведущего производителя ковров и штор под заказ в Российской Федерации.</span></p>
      `,
      partnersSiteDeadTitle: "Чтобы заказать ковролин вам не нужен сайт!",
    },
    settings: {
      pingEndpoint: "/local/templates/new/static/dist/img/close.svg",
      renamedLinks: [],
      restrictedLinks: [],
      scripts: {
        jivochat: "//code.jivosite.com/widget/WPBvGc2oxZ",
      },
    },
  };

  public data: CmsData;

  constructor() {
    this.data = { ...this.defaultValue };
  }

  private async fetch(): Promise<CmsData> {
    try {
      const fetchResult = await fetchDato<{ config: CmsData }>(`
        query {
          config {
            contact {
              address
              unp
              bank
              bankBic
              email
              phone
              person
            }
            content {
              headerGreyText
              partnersSiteDeadTitle
            }
            settings {
              pingEndpoint
              homepageLink {
                url
              }
              renamedLinks {
                url
                text
              }
              restrictedLinks {
                url
              }
              scripts {
                jivochat
              }
            }
          }
        }
      `);
      if (!fetchResult.config) {
        throw new Error("No config provided");
      }
      logger.info("CMS successfully fetched", fetchResult.config);
      return fetchResult.config;
    } catch (error) {
      logger.error("Dato CMS fetch error", error);
      return this.data || this.defaultValue;
    }
  }

  async init(): Promise<CmsData> {
    return this.fetch()
      .then((data) => {
        this.data = data;
        return data;
      })
      .catch((error) => {
        logger.error("Dato CMS fetch error", error);
        throw error;
      });
  }

  async refresh(): Promise<PublicCmsData> {
    const fresh = await this.fetch();
    this.data = fresh;
    return {
      content: fresh.content,
      contact: fresh.contact,
    };
  }
}

const globalForServices = globalThis as typeof globalThis & {
  headlessCms?: HeadlessCmsService;
};

// singleton
export const headlessCms =
  globalForServices.headlessCms ??
  (() => {
    const service = new HeadlessCmsService();
    globalForServices.headlessCms = service;
    return service;
  })();
