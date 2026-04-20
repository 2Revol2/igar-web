import { notFound } from "next/navigation";
import { fetchCmsData, fetchPageData } from "@/src/lib/client/page-data";
import { PartnersCssLoader } from "@/src/components/PartnersCssLoader";
import { AppPageScripts } from "./PageScripts";
import { AppHeader } from "./Header/header";
import { AppSafeContent } from "./content";

interface PageRendererProps {
  path: string;
  isInstrumentation: boolean;
}

export const PageRenderer = async ({ path, isInstrumentation }: PageRendererProps) => {
  const { content, links, scripts, headerNavbar } = await fetchPageData(path);
  const cms = await fetchCmsData(isInstrumentation);

  if (!content) {
    return notFound();
  }

  return (
    <>
      {links?.map((link, index) =>
        /css\/style\.bundle\.css/.test(link.href) ? (
          <PartnersCssLoader key={index + link.href} href={link.href} />
        ) : (
          <link key={index + link.href} rel={link.rel} href={link.href} type={link.type} />
        ),
      )}

      <AppHeader headerNavbar={headerNavbar} />
      {/*<AppHeader headerNavbar={headerNavbar} cms={cms} />*/}
      <AppSafeContent html={content} />
      <AppPageScripts scripts={scripts} />
      {/*<AppPageScripts scripts={scripts} isInstrumentation={isInstrumentation} />*/}
    </>
  );
};
