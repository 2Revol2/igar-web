import { fetchCmsData, fetchHeartbeat } from "@/src/lib/client/page-data";
import { PageContent } from "@/src/components/PageContent";
import { PartnersWebsiteDown } from "@/src/components/PartnersWebsiteDown";
import { PriceObserver } from "@/src/components/PriceObserver";

interface PageRendererProps {
  path: string;
  isInstrumentation: boolean;
}

export const PageRenderer = async ({ path, isInstrumentation }: PageRendererProps) => {
  const cms = await fetchCmsData(isInstrumentation);
  const { ok } = await fetchHeartbeat();

  return ok ? (
    <>
      <PageContent path={path} cms={cms} />
      <PriceObserver priceMultiplier={cms?.content.priceMultiplier} />
    </>
  ) : (
    <PartnersWebsiteDown cms={cms} />
  );
};
