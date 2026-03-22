// eslint-disable-next-line @typescript-eslint/no-require-imports
const { config } = require("./app/config.ts");
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/upload/:path*",
        destination: `${config.SOURCE_WEBSITE}/upload/:path*`,
      },
      {
        source: "/local/templates/:path*",
        destination: `${config.SOURCE_WEBSITE}/local/templates/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
