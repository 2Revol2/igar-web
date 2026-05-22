import "./globals.css";

import { Inter, Montserrat, Roboto } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { AppGreenLine } from "@/src/components/AppGreenLine";
import { getBitrixHtmlClasses } from "@/src/lib/client/bitrix-classes";
import { config } from "@/config";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") ?? "";
  const bitrixClasses = getBitrixHtmlClasses(userAgent);

  return (
    <html lang="ru" className={bitrixClasses}>
      <head>
        <link rel="stylesheet" href="/ab-market/partners.bundle.css" />

        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${config.GTM_MEASURE_ID}');
          `,
          }}
        />
      </head>
      <body id="ab-market" className={`${inter.className} ${roboto.className} ${montserrat.className}`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${config.GTM_MEASURE_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <AppGreenLine />
        <div>{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
