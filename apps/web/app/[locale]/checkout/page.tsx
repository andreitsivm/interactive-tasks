import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { fetchCatalog } from "@/lib/paddle";
import { CheckoutOverlay } from "./_components/CheckoutOverlay";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  const { subscriptionPlan, email, id } = session.user;
  if (subscriptionPlan === "trial" || subscriptionPlan === "pro") {
    redirect("/dashboard");
  }

  let trialPriceId = "";
  try {
    const catalog = await fetchCatalog();
    const trialItem = catalog.find(
      (item) => item.plan === "pro" && item.hasTrial,
    );
    trialPriceId = trialItem?.priceId ?? "";
  } catch (err) {
    console.error("[checkout] Failed to fetch catalog:", err);
  }

  return (
    <CheckoutOverlay
      userEmail={email ?? ""}
      userId={id}
      priceId={trialPriceId}
    />
  );
}
