export interface PaddlePrice {
  id: string;
  description: string;
  unitPrice: { amount: string; currencyCode: string };
  product: { name: string; description: string };
}

export async function fetchPaddlePrices(
  priceIds: string[],
): Promise<PaddlePrice[]> {
  if (priceIds.length === 0) return [];

  const res = await fetch(
    `https://api.paddle.com/prices?ids=${priceIds.join(",")}&include=product`,
    {
      headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) throw new Error(`Paddle prices fetch failed: ${res.status}`);

  const json: { data: PaddlePrice[] } = await res.json();
  return json.data;
}
