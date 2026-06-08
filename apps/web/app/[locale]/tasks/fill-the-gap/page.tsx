import { FillTheGapContainer } from "./_components/FillTheGapContainer";

export default function FillTheGapPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
          Task generator
        </p>
        <h1 className="text-3xl font-bold">Fill the Gap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure and generate an interactive fill-the-gap exercise.
        </p>
      </div>
      <FillTheGapContainer />
    </main>
  );
}
