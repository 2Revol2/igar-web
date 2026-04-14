// lib/request-memory.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAtMostOncePerHour, resetRequestMemory } from "./request-memory";

describe("fetchAtMostOncePerHour", () => {
  beforeEach(() => {
    resetRequestMemory();
    vi.restoreAllMocks();
  });

  it("делает запрос при первом вызове", async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1 });

    const result = await fetchAtMostOncePerHour("page1/article1", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      skipped: false,
      data: { id: 1 },
    });
  });

  it("не делает повторный запрос в течение часа", async () => {
    vi.spyOn(Date, "now")
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(1_000 + 30 * 60 * 1000);

    const fetcher = vi.fn().mockResolvedValue({ id: 1 });

    const first = await fetchAtMostOncePerHour("page1/article1", fetcher);
    const second = await fetchAtMostOncePerHour("page1/article1", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(first).toEqual({
      skipped: false,
      data: { id: 1 },
    });
    expect(second).toEqual({
      skipped: true,
    });
  });

  it("делает новый запрос после истечения часа", async () => {
    vi.spyOn(Date, "now")
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(1_000)
      .mockReturnValueOnce(1_000 + 60 * 60 * 1000 + 1)
      .mockReturnValueOnce(1_000 + 60 * 60 * 1000 + 1);

    const fetcher = vi.fn().mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce({ id: 2 });

    const first = await fetchAtMostOncePerHour("page1/article1", fetcher);
    const second = await fetchAtMostOncePerHour("page1/article1", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(first).toEqual({
      skipped: false,
      data: { id: 1 },
    });
    expect(second).toEqual({
      skipped: false,
      data: { id: 2 },
    });
  });

  it("хранит throttle отдельно для разных ключей", async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true });

    const a = await fetchAtMostOncePerHour("page1/article1", fetcher);
    const b = await fetchAtMostOncePerHour("page1/article2", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(a).toEqual({
      skipped: false,
      data: { ok: true },
    });
    expect(b).toEqual({
      skipped: false,
      data: { ok: true },
    });
  });

  it("не запускает два параллельных одинаковых запроса", async () => {
    let resolveFetcher!: (value: { ok: boolean }) => void;

    const fetcher = vi.fn(
      () =>
        new Promise<{ ok: boolean }>((resolve) => {
          resolveFetcher = resolve;
        }),
    );

    const promise1 = fetchAtMostOncePerHour("page1/article1", fetcher);
    const promise2 = fetchAtMostOncePerHour("page1/article1", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);

    resolveFetcher({ ok: true });

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(result1).toEqual({
      skipped: false,
      data: { ok: true },
    });
    expect(result2).toEqual({
      skipped: false,
      data: { ok: true },
    });
  });

  it("после ошибки не записывает timestamp и позволяет повторить запрос", async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error("upstream failed")).mockResolvedValueOnce({ ok: true });

    await expect(fetchAtMostOncePerHour("page1/article1", fetcher)).rejects.toThrow("upstream failed");

    const second = await fetchAtMostOncePerHour("page1/article1", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(second).toEqual({
      skipped: false,
      data: { ok: true },
    });
  });

  it("после ошибки очищает inFlight и следующий вызов реально идет заново", async () => {
    let rejectFetcher!: (error: Error) => void;

    const fetcher = vi.fn(
      () =>
        new Promise((_, reject) => {
          rejectFetcher = reject;
        }),
    );

    const first = fetchAtMostOncePerHour("page1/article1", fetcher);
    const second = fetchAtMostOncePerHour("page1/article1", fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);

    rejectFetcher(new Error("network error"));

    await expect(first).rejects.toThrow("network error");
    await expect(second).rejects.toThrow("network error");

    const nextFetcher = vi.fn().mockResolvedValue({ ok: true });

    const third = await fetchAtMostOncePerHour("page1/article1", nextFetcher);

    expect(nextFetcher).toHaveBeenCalledTimes(1);
    expect(third).toEqual({
      skipped: false,
      data: { ok: true },
    });
  });
});
