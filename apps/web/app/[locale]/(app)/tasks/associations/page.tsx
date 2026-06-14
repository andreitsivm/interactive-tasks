import { AssociationsContainer } from "./_components/AssociationsContainer";

export default function AssociationsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">
          Task generator
        </p>
        <h1 className="text-3xl font-bold">Associations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure and generate an interactive associations exercise.
        </p>
      </div>
      <AssociationsContainer />
    </main>
  );
}
