/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    // HSTS
    {
      source: "/(.*)",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
    },
  ],
  output: "standalone",
};

module.exports = nextConfig;
