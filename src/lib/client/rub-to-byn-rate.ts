export async function getRubToBynRate(): Promise<number> {
  const primaryUrl = "https://api.nbrb.by/exrates/rates/RUB?parammode=2";

  const fallbackUrl = "https://latest.currency-api.pages.dev/v1/currencies/rub.json";

  try {
    const res = await fetch(primaryUrl, {
      next: { revalidate: 60 * 60 }, // 1 hour
    });

    if (!res.ok) {
      throw new Error(`NBRB request failed: ${res.status}`);
    }

    const data: {
      Cur_ID: number;
      Cur_Abbreviation: string;
      Cur_Scale: number;
      Cur_OfficialRate: number;
    } = await res.json();

    if (!data.Cur_OfficialRate || !data.Cur_Scale) {
      throw new Error("Invalid NBRB response");
    }

    // Например, если 100 RUB = 3.7003 BYN,
    // то 1 RUB = 3.7003 / 100
    return data.Cur_OfficialRate / data.Cur_Scale;
  } catch (error) {
    console.warn("Primary API failed, using fallback...", error);

    const fallbackRes = await fetch(fallbackUrl, {
      next: { revalidate: 60 * 60 },
    });

    if (!fallbackRes.ok) {
      throw new Error(`Fallback request failed: ${fallbackRes.status}`);
    }

    const fallbackData: {
      rub: {
        byn: number;
      };
    } = await fallbackRes.json();

    return fallbackData.rub.byn;
  }
}
