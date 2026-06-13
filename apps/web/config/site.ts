export const siteConfig = {
  name: "TBD",
  tagline: {
    en: "Generate interactive learning tasks in seconds",
    ua: "Генеруй інтерактивні навчальні завдання за секунди",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/og.png`,
  description: {
    en: "AI-powered platform for creating fill-the-gap tests, vocabulary exercises, word associations, and other interactive educational tasks — configurable by topic, level, and language.",
    ua: "AI-платформа для створення тестів fill-the-gap, словникових вправ, асоціацій та інших інтерактивних навчальних завдань — гнучке налаштування теми, рівня та мови.",
  },
  links: {
    twitter: "",
    github: "",
  },
  paddle: {
    clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "",
    environment: (process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox") as
      | "sandbox"
      | "production",
  },
  taskTypes: [
    {
      slug: "fill-the-gap",
      label: { en: "Fill the Gap", ua: "Заповни пропуск" },
    },
    { slug: "associations", label: { en: "Associations", ua: "Асоціації" } },
    {
      slug: "vocabulary",
      label: { en: "Vocabulary", ua: "Словниковий запас" },
    },
  ],
  legalPages: [
    {
      slug: "privacy-policy",
      label: { en: "Privacy Policy", ua: "Політика конфіденційності" },
    },
    {
      slug: "terms-of-service",
      label: { en: "Terms of Service", ua: "Умови використання" },
    },
    {
      slug: "cookie-policy",
      label: { en: "Cookie Policy", ua: "Політика cookies" },
    },
  ],
} as const;
