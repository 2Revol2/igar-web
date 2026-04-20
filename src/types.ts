export type PageMetadata = { title: string; description: string; keywords: string };

export type HeadLink = {
  rel: string;
  href: string;
  type: string;
};

export type CachedScript = {
  src: string;
  innerHTML: string;
  type: string;
  defer: boolean;
  async: boolean;
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

type CmsContent = {
  headerGreyText: string;
  partnersSiteDeadTitle: string;
};

type ContactInfo = {
  address: string;
  unp: string;
  bank: string;
  bankBic: string;
  email: string;
  phone: string;
  person: string;
};

export type PublicCmsData = {
  contact: ContactInfo;
  content: CmsContent;
};

export type CmsData = {
  contact: ContactInfo;
  content: CmsContent;
  settings: {
    routesMap: string[];
    pingEndpoint: string;
  };
};

export type Heartbeat = {
  ok: boolean;
};
