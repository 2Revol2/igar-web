import { notFound } from "next/navigation";
import { fetchPageData } from "@/src/lib/client/page-data";
import { AppHeader } from "./Header/header";
import { AppSafeContent } from "./content";

interface PageRendererProps {
  path: string;
}

export const PageRenderer = async ({ path }: PageRendererProps) => {
  const { content, links, scripts, headerNavbar } = await fetchPageData(path);

  if (!content) {
    return notFound();
  }

  return (
    <>
      {links?.map((link, index) => (
        <link key={index} rel={link.rel} href={link.href} type={link.type} />
      ))}

      <AppHeader headerNavbar={headerNavbar} />
      <AppSafeContent html={content} />

      {scripts?.map((script, index) =>
        script.src ? (
          <script key={index} src={script.src} async={script.async} defer={script.defer} />
        ) : (
          <script
            key={index}
            async={script.async}
            defer={script.defer}
            dangerouslySetInnerHTML={{ __html: script.innerHTML }}
          />
        ),
      )}
    </>
  );
};
