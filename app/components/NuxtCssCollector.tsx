"use client";

import { useEffect, useRef } from "react";

function hasAbMarketCookie() {
  return document.cookie.split("; ").some((item) => item === "ab-market=1");
}

function collectStylesheetLinks() {
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];

  return [...new Set(links.map((link) => link.href).filter(Boolean))];
}

/**
 * Component to collect all nuxt css styles
 * NOTE: You must set "ab-market" cookie as 1
 */
export const NuxtCssCollector = () => {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!hasAbMarketCookie()) return;
    if (sentRef.current) return;

    const timer = window.setTimeout(async () => {
      try {
        const hrefs = collectStylesheetLinks();

        const nuxtCss = hrefs.filter((href) => {
          return href.includes("/_nuxt/") || href.includes("nuxt") || href.includes("/local/templates/");
        });

        window.alert(`NuxtCssCollector collected, links: ${nuxtCss.length}`);
        if (!nuxtCss.length) return;

        sentRef.current = true;

        await fetch("/api/css-collect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hrefs: nuxtCss,
            pageUrl: window.location.href,
          }),
        });

        document.cookie = "ab-market=; path=/; max-age=0";
      } catch (error) {
        console.error("Failed to collect partner css", error);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return null;
};
