import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchCatalog } from "@/lib/paddle";
import { ExpiredInterstitial } from "./_components/ExpiredInterstitial";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const isExpired = session.user.subscriptionPlan === "expired";

  let directPriceId = "";
  if (isExpired) {
    try {
      const catalog = await fetchCatalog();
      const directItem = catalog.find(
        (item) => item.plan === "pro" && !item.hasTrial,
      );
      directPriceId = directItem?.priceId ?? "";
    } catch {
      // catalog unavailable — interstitial shown, upgrade button inactive
    }
  }

  if (isExpired) {
    return (
      <ExpiredInterstitial
        userEmail={session.user.email ?? ""}
        userId={session.user.id}
        priceId={directPriceId}
      />
    );
  }

  return <>{children}</>;
}
