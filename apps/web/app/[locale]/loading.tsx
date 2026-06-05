import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
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
