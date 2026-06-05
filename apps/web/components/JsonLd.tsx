function safeStringify(obj: object): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeStringify(schema) }}
    />
  );
}
