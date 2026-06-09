import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

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
