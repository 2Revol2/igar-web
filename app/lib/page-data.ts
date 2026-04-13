import { getSsrBaseUrl } from "@/app/helpers/request.helpers";
import type { ContentResponse } from "@/app/types";

const buildId = process.env.BUILD_ID;

const isDev = process.env.NODE_ENV !== "production";
const revalidationFrequency = isDev ? 30 : 3600;

export const fetchPageData = async (pathToFetch: string): Promise<ContentResponse> => {
  let path = pathToFetch;
  const isAb = pathToFetch.includes("?ab=");
  if (isAb) {
    path = pathToFetch.replace(/\?ab=\d+/, "");
  }
  const body = JSON.stringify({ path, isAb });
  const baseUrl = await getSsrBaseUrl();
  const ending = buildId ? `?build-id=${buildId}` : "";
  const response = await fetch(`${baseUrl}/api/content${ending}`, {
    method: "PUT",
    body,
    next: { revalidate: revalidationFrequency },
  });
  return response.json();
};
