"use client";

import { useEffect, useRef } from "react";
import { config } from "@/config";

function hasAbMarketCookie() {
  return document.cookie.split("; ").some((item) => item === "ab-market=1");
}

/**
 * Component to collect all nuxt css styles
 * NOTE: You must set "ab-market" cookie as 1
 */
export const NextCssCollector = () => {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!hasAbMarketCookie()) return;
    if (sentRef.current) return;

    const timer = window.setTimeout(async () => {
      try {
        const baseUrl = config.SOURCE_WEBSITE;
        const scripts = Array.from(document.querySelectorAll("script"));
        const nextCssSet = new Set<string>();
        scripts.forEach((script) => {
          const content = script.textContent || "";
          const normalized = content.replace(/\\\//g, "/");
          const matches = normalized.match(/\/_next\/static\/css\/[^"'\\\s)]+\.css/g) || [];
          matches.forEach((m) => nextCssSet.add(baseUrl + m.split("?")[0]));
        });
        const nextCss = [...nextCssSet];
        window.alert(`NuxtCssCollector collected, links: ${nextCss.length}`);
        if (!nextCss.length) return;
        sentRef.current = true;
        await fetch("/api/css-collect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hrefs: nextCss,
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
