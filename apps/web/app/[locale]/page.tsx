import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { TaskTypesSection } from "@/components/sections/TaskTypesSection";
import { DemoSection } from "@/components/sections/DemoSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Skeleton } from "@/components/ui/skeleton";

function PricingSkeleton() {
  return (
    <div className="w-full py-24 px-4 max-w-5xl mx-auto">
      <Skeleton className="h-8 w-48 mx-auto mb-4" />
      <Skeleton className="h-4 w-72 mx-auto mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TaskTypesSection />
        <DemoSection />
        <Suspense fallback={<PricingSkeleton />}>
          <PricingSection />
        </Suspense>
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
