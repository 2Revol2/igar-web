import "./globals.css";
import { PriceObserver } from "@/app/components/PriceObserver";
import { getRubToBynRate } from "@/app/lib/rub-to-byn-rate";

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const rubToBynRate = await getRubToBynRate();
  console.log(`rubToBynRate  = ${rubToBynRate}`);

  return (
    <html lang="ru">
      <head>
        <link rel="stylesheet" href="ab-market.css" />
      </head>
      <body id="ab-market">{children}</body>
      <PriceObserver rubToBynRate={rubToBynRate} />
    </html>
  );
};

export default RootLayout;
