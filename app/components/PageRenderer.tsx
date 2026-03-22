import Script from "next/script";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { AppSafeContent } from "@/app/components/content";
import { fetchPageData } from "@/app/lib/page-data";

export const PageRenderer = async () => {
  const h = await headers();
  const currentUrl = h.get("x-url") ?? "";
  const urlPath = currentUrl.replace(/^https?:\/\/[^/]+/, "");

  const { content, links, scripts } = await fetchPageData(urlPath);

  if (!content) {
    return notFound();
  }

  return (
    <>
      {links?.map((link, index) => (
        <link key={index} rel={link.rel} href={link.href} type={link.type} />
      ))}

      <AppSafeContent html={content} />

      {scripts?.map((script, index) =>
        script.src ? (
          <Script key={index} src={script.src} strategy="afterInteractive" />
        ) : (
          <Script
            key={index}
            id={`inline-script-${index}`}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: script.innerHTML || "" }}
          />
        ),
      )}
    </>
  );
};
