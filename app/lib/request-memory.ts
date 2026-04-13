const ONE_HOUR = 60 * 60 * 1000;

const lastRequests = new Map<string, number>();
const inFlightRequests = new Map<string, Promise<ResponseData>>();

type ResponseData = {
  ok: boolean;
  skipped: boolean;
  data?: unknown;
};

export async function fetchAtMostOncePerHour(key: string, fetcher: () => Promise<unknown>): Promise<ResponseData> {
  const now = Date.now();
  const lastRequestAt = lastRequests.get(key);

  if (lastRequestAt && now - lastRequestAt < ONE_HOUR) {
    return {
      ok: true,
      skipped: true,
    };
  }

  const inFlight = inFlightRequests.get(key);
  if (inFlight) {
    return inFlight;
  }

  const promise = (async () => {
    try {
      const data = await fetcher();
      lastRequests.set(key, Date.now());

      return {
        ok: true,
        skipped: false,
        data,
      };
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, promise);

  return promise;
}

export function resetRequestMemory() {
  lastRequests.clear();
  inFlightRequests.clear();
}
