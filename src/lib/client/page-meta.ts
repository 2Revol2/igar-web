import { fetchCmsData, fetchPageData } from "./page-data";
import type { Metadata } from "next";

export type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ path: string | string[] | undefined }>;
};

export const setPageMeta = async ({ searchParams, params }: PageProps): Promise<Metadata> => {
  const sp = await searchParams;
  const { path } = await params;
  const pathname = Array.isArray(path) ? `/${path.join("/")}/` : path ? `/${path}/` : "/";

  const cms = await fetchCmsData(false);

  const customPage = cms?.customPages?.find((page) => page.slug === pathname);

  if (customPage) {
    return {
      title: customPage.seo.title,
      description: customPage.seo.description,
      keywords: customPage.keywords,
    };
  }

  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(sp || {})) {
    if (typeof value === "string") {
      filtered[key] = value;
    } else if (Array.isArray(value)) {
      filtered[key] = value.join(",");
    }
  }

  const queryString = new URLSearchParams(filtered).toString();
  const fullUrl = `${pathname}${queryString ? "?" + queryString : ""}`;

  const { meta } = await fetchPageData(fullUrl);

  return {
    title: meta?.title,
    description: meta?.description,
    keywords: meta?.keywords,
  };
};
