"use client";
import { useEffect, useState } from "react";

interface RubRate {
  Cur_ID: number;
  Cur_Abbreviation: string;
  Cur_Scale: number;
  Cur_OfficialRate: number;
}

const STORAGE_KEY = "rub_byn_rate";
const DEFAULT_VALUE = 0.038149999999999996;

async function getRubToBynRate(): Promise<number> {
  const primaryUrl = "https://api.nbrb.by/exrates/rates/RUB?parammode=2";

  const fallbackUrl = "https://latest.currency-api.pages.dev/v1/currencies/rub.json";

  const cached = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

  try {
    const res = await fetch(primaryUrl, {
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) {
      throw new Error(`NBRB request failed: ${res.status}`);
    }

    const data: RubRate = await res.json();

    if (!data.Cur_OfficialRate || !data.Cur_Scale) {
      throw new Error("Invalid NBRB response");
    }

    // Например, если 100 RUB = 3.7003 BYN,
    // то 1 RUB = 3.7003 / 100
    const rate = data.Cur_OfficialRate / data.Cur_Scale;

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rate));
    }

    return rate;
  } catch (error) {
    console.log("Primary API failed, using fallback...", error);

    if (cached) {
      return JSON.parse(cached);
    }

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

    if (!fallbackData.rub.byn) {
      throw new Error("Invalid response");
    }

    return fallbackData.rub.byn;
  }
}

export function useRubToBynRate() {
  const [rate, setRate] = useState<number>(DEFAULT_VALUE);

  useEffect(() => {
    let mounted = true;

    const loadRate = async () => {
      const result = await getRubToBynRate();

      if (mounted) {
        setRate(result);
      }
    };

    loadRate();

    return () => {
      mounted = false;
    };
  }, []);

  return rate;
}
