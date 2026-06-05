/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@firstweeks/shared', '@firstweeks/db', '@firstweeks/ai'],
};

module.exports = nextConfig;