import { headlessCms } from "@/src/services/api/headless-cms.service";
import { fetchPageData } from "./page-data";
import type { Metadata } from "next";

export type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ path: string | string[] | undefined }>;
};

export const setPageMeta = async ({ searchParams, params }: PageProps): Promise<Metadata> => {
  const sp = await searchParams;
  const { path } = await params;
  const pathname = Array.isArray(path) ? `/${path.join("/")}/` : path ? `/${path}/` : "/";

  const customPage = headlessCms.data?.customPages?.find((page) => page.slug === pathname);

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
    title: customPage ? customPage.seo.title : meta?.title,
    description: customPage ? customPage.seo.description : meta?.description,
    keywords: customPage ? customPage.keywords : meta?.keywords,
  };
};
