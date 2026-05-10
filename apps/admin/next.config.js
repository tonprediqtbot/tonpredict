/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@tonbet/database", "@tonbet/contracts"],
};

module.exports = nextConfig;
