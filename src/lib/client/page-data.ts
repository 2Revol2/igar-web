import { getSsrBaseUrl } from "@/src/helpers/client/request.helpers";
import { AbQuery } from "@/src/constants";
import type { ContentResponse, PublicCmsData } from "@/src/types";

const buildId = process.env.BUILD_ID;

const isDev = process.env.NODE_ENV !== "production";
const revalidationFrequency = isDev ? 30 : 3600;

export const fetchPageData = async (pathToFetch: string): Promise<ContentResponse> => {
  const body = JSON.stringify({ path: pathToFetch });
  const options = { method: "PUT", body, next: { revalidate: revalidationFrequency } };
  const baseUrl = await getSsrBaseUrl();
  const ending = buildId ? `?build-id=${buildId}` : "";
  const response = await fetch(`${baseUrl}/api/ab-content${ending}`, options);
  return response.json();
};

export const fetchCmsData = async (isInstrumentation: boolean): Promise<PublicCmsData> => {
  const options = { method: "GET", next: { revalidate: revalidationFrequency } };
  const baseUrl = await getSsrBaseUrl();
  const ending = isInstrumentation ? `?${AbQuery}=yes` : "";
  const response = await fetch(`${baseUrl}/api/ab-cms${ending}`, options);
  return response.json();
};
