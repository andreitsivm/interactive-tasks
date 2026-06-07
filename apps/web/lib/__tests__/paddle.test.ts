import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@paddle/paddle-node-sdk", () => {
  const mockList = vi.fn();
  return {
    Paddle: vi.fn().mockImplementation(() => ({
      products: { list: mockList },
    })),
    Environment: { Sandbox: "sandbox", Production: "production" },
    __mockList: mockList,
  };
});

const { __mockList } = (await import("@paddle/paddle-node-sdk")) as unknown as {
  __mockList: ReturnType<typeof vi.fn>;
};

const { fetchCatalog } = await import("../paddle");

describe("fetchCatalog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PADDLE_API_KEY = "test_api_key";
  });

  it("returns catalog items for active products with valid plan custom_data", async () => {
    __mockList.mockReturnValue(
      (async function* () {
        yield {
          id: "pro_1",
          name: "Pro Plan",
          description: "Best plan",
          customData: { plan: "pro" },
          status: "active",
          prices: [
            {
              id: "pri_1",
              status: "active",
              unitPrice: { amount: "2900", currencyCode: "USD" },
              billingCycle: { interval: "month", frequency: 1 },
              customData: null,
            },
          ],
        };
      })(),
    );

    const items = await fetchCatalog();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      priceId: "pri_1",
      productName: "Pro Plan",
      productDescription: "Best plan",
      amount: "2900",
      currencyCode: "USD",
      billingInterval: "month",
      plan: "pro",
    });
  });

  it("excludes products without a valid plan in custom_data", async () => {
    __mockList.mockReturnValue(
      (async function* () {
        yield {
          id: "pro_orphan",
          name: "Orphan",
          description: null,
          customData: null,
          status: "active",
          prices: [
            {
              id: "pri_orphan",
              status: "active",
              unitPrice: { amount: "100", currencyCode: "USD" },
              billingCycle: null,
              customData: null,
            },
          ],
        };
      })(),
    );

    const items = await fetchCatalog();
    expect(items).toHaveLength(0);
  });

  it("excludes archived prices", async () => {
    __mockList.mockReturnValue(
      (async function* () {
        yield {
          id: "pro_2",
          name: "Starter",
          description: null,
          customData: { plan: "starter" },
          status: "active",
          prices: [
            {
              id: "pri_archived",
              status: "archived",
              unitPrice: { amount: "900", currencyCode: "USD" },
              billingCycle: { interval: "month", frequency: 1 },
              customData: null,
            },
          ],
        };
      })(),
    );

    const items = await fetchCatalog();
    expect(items).toHaveLength(0);
  });
});
