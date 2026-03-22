import { headers } from "next/headers";
import { PageRenderer } from "@/app/components/PageRenderer";
import { setPageMeta } from "@/app/lib/page-meta";
import type { PageProps } from "@/app/lib/page-meta";
import type { Metadata } from "next";

export async function generateMetadata(pageProps: PageProps): Promise<Metadata> {
  return setPageMeta(pageProps);
}

const PageComponent = async () => {
  const h = await headers();
  const currentUrl = h.get("x-url") ?? "";

  return <PageRenderer path={currentUrl} />;
};

export default PageComponent;
