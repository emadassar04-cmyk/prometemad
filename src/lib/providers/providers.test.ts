import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pollinationsProvider } from "./pollinations";
import { falProvider } from "./fal";
import { generateImage } from "./index";

describe("pollinationsProvider", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("builds a URL-encoded prompt with the requested dimensions", async () => {
    const result = await pollinationsProvider.generateImage("a cat, {{studio}} shot", {
      width: 512,
      height: 768,
    });

    expect(result.provider).toBe("pollinations");
    expect(result.imageUrl).toContain(encodeURIComponent("a cat, {{studio}} shot"));
    expect(result.imageUrl).toContain("width=512");
    expect(result.imageUrl).toContain("height=768");
    expect(fetchMock).toHaveBeenCalledWith(result.imageUrl);
  });

  it("throws when Pollinations responds with a non-ok status", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    await expect(pollinationsProvider.generateImage("a cat")).rejects.toThrow("503");
  });
});

describe("falProvider", () => {
  const originalKey = process.env.FAL_KEY;

  afterEach(() => {
    if (originalKey === undefined) delete process.env.FAL_KEY;
    else process.env.FAL_KEY = originalKey;
  });

  it("throws when FAL_KEY is not configured", async () => {
    delete process.env.FAL_KEY;
    await expect(falProvider.generateImage("a cat")).rejects.toThrow("FAL_KEY");
  });
});

describe("generateImage provider selection", () => {
  const originalProvider = process.env.IMAGE_PROVIDER;

  afterEach(() => {
    if (originalProvider === undefined) delete process.env.IMAGE_PROVIDER;
    else process.env.IMAGE_PROVIDER = originalProvider;
    vi.unstubAllGlobals();
  });

  it("defaults to pollinations when IMAGE_PROVIDER is unset", async () => {
    delete process.env.IMAGE_PROVIDER;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const result = await generateImage("a dog");
    expect(result.provider).toBe("pollinations");
  });

  it("throws for an unknown IMAGE_PROVIDER value", async () => {
    process.env.IMAGE_PROVIDER = "does-not-exist";
    await expect(generateImage("a dog")).rejects.toThrow("Unknown IMAGE_PROVIDER");
  });
});
