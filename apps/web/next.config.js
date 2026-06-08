import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// VERCEL_URL is the auto-assigned deployment URL (e.g. project-git-dev-user.vercel.app).
// Use it as a fallback when NEXTAUTH_URL is not explicitly set (staging preview deploys).
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/types", "@workspace/mail"],
  async rewrites() {
    const nestApiUrl = process.env.NESTJS_API_URL;
    if (!nestApiUrl) return [];
    return [
      {
        source: "/api/docs/:path*",
        destination: `${nestApiUrl}/api/docs/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
