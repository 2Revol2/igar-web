import type { CdaStructuredTextValue } from "react-datocms";

export type PageMetadata = { title: string; description: string; keywords: string };

export type HeadLink = {
  rel: string;
  href: string;
  type: string;
};

export type CachedScript = {
  src: string;
  innerHTML?: string;
  type?: string;
  defer?: boolean;
  async?: boolean;
};

export type ContentResponse = {
  content: string;
  meta: PageMetadata;
  links: HeadLink[];
  scripts: CachedScript[];
  headerNavbar: string;
};

export type AbMarketPageParams = {
  searchParams: { [key: string]: string | string[] | undefined };
  params: {
    path: string[];
  };
};

type TextReplacementRule = {
  from: string;
  to: string;
};

type TextReplacement = {
  paths: string[];
  rules: TextReplacementRule[];
};

type CmsContent = {
  headerGreyText: string;
  partnersSiteDeadTitle: string;
  priceMultiplier: number;
  textReplacements: TextReplacement[];
};

type Coords = {
  lat: number;
  lng: number;
};

type ContactInfo = {
  address: string;
  unp: string;
  bank: string;
  bankBic: string;
  email: string;
  phone: string;
  person: string;
  map: {
    centerCoords: Coords;
    markerCoords: Coords[];
  };
};

export type CmsLink = {
  url: string;
  text?: string;
};

type CustomPageImage = {
  url: string;
  alt: string;
  title: string;
  width: number;
  height: number;
};

type CustomPageSeo = {
  title: string;
  description: string;
  twitterCard: string;
  noIndex: boolean;
  image: CustomPageImage;
};

export type CustomPage = {
  label: string;
  slug: string;
  keywords: string;
  pageContent: {
    value: CdaStructuredTextValue;
  };
  image: CustomPageImage;
  seo: CustomPageSeo;
};

export type PublicCmsData = {
  contact: ContactInfo;
  content: CmsContent;
  customPages?: CustomPage[];
};

export type CmsDataResponse = {
  config: {
    contact: ContactInfo;
    content: CmsContent;
    settings: {
      pingEndpoint: string;
      homepageLink?: CmsLink;
      renamedLinks: CmsLink[];
      restrictedLinks: CmsLink[];
      scripts: {
        jivochat?: string;
      };
      metadataTextReplacement: Record<string, string>;
    };
  };
  allCustomPages: CustomPage[];
};

export type CmsData = {
  contact: ContactInfo;
  content: CmsContent;
  settings: {
    pingEndpoint: string;
    homepageLink?: string;
    renamedLinks: CmsLink[];
    restrictedLinks: string[];
    scripts: {
      jivochat?: string;
    };
    metadataTextReplacement: Record<string, string>;
  };
  customPages?: CustomPage[];
};

export type Heartbeat = {
  ok: boolean;
};

export type PagePathWithKey = {
  initialPath: string;
  realPath: string;
  cacheKey: string;
};
