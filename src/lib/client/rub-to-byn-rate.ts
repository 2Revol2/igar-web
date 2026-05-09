import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "node:fs";

const CACHE_DIR = join(process.cwd(), "cache");
const RATE_CACHE_FILE = join(CACHE_DIR, "rub-byn-rate.json");

interface RubRate {
  Cur_ID: number;
  Cur_Abbreviation: string;
  Cur_Scale: number;
  Cur_OfficialRate: number;
}

export async function getRubToBynRate(): Promise<number> {
  const url = "https://api.nbrb.by/exrates/rates/RUB?parammode=2";

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 * 60 }, // 1 hour
    });

    if (!res.ok) {
      throw new Error(`NBRB request failed: ${res.status}`);
    }

    const data: RubRate = await res.json();

    if (!data.Cur_OfficialRate || !data.Cur_Scale) {
      throw new Error("Invalid NBRB response");
    }

    await writeFile(RATE_CACHE_FILE, JSON.stringify(data), "utf-8");

    return data.Cur_OfficialRate / data.Cur_Scale;
  } catch (error) {
    console.error("[RUB/BYN] API failed", error);
    try {
      if (!existsSync(RATE_CACHE_FILE)) {
        throw new Error("Cache does not exist");
      }

      const dataRaw = await readFile(RATE_CACHE_FILE, "utf-8");
      const data = JSON.parse(dataRaw) as RubRate;

      if (!data.Cur_OfficialRate || !data.Cur_Scale) {
        throw new Error("Invalid cache");
      }

      return data.Cur_OfficialRate / data.Cur_Scale;
    } catch (cacheError) {
      console.error("[RUB/BYN] Cache fallback failed", cacheError);
      throw new Error("Unable to get RUB/BYN rate");
    }
  }
}
