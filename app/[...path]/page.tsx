import { PageRenderer } from "@/app/components/PageRenderer";
import { setPageMeta } from "@/app/lib/page-meta";
import type { PageProps } from "@/app/lib/page-meta";
import type { Metadata } from "next";

export async function generateMetadata(pageProps: PageProps): Promise<Metadata> {
  return setPageMeta(pageProps);
}

const PageComponent = async ({ params }: { params: Promise<{ path: string[] }> }) => {
  const { path } = await params;
  const normalizedPaths = `/${path.join("/")}`;
  return <PageRenderer path={normalizedPaths} />;
};

export default PageComponent;
