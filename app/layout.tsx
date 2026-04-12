import "./globals.css";
import { PriceObserver } from "@/app/components/PriceObserver";
import { NextCssCollector } from "@/app/components/NextCssCollector";
import { getRubToBynRate } from "@/app/lib/rub-to-byn-rate";

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const rubToBynRate = await getRubToBynRate();

  return (
    <html lang="ru">
      <head>
        <link rel="stylesheet" href="/ab-market.css" />
      </head>
      <body id="ab-market">{children}</body>
      <PriceObserver rubToBynRate={rubToBynRate} />
      <NextCssCollector />
    </html>
  );
};

export default RootLayout;
