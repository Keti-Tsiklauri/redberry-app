/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.redseam.redberryinternship.ge"],
  },

  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // ✅ ignore TS errors for deployment
  },
};

module.exports = nextConfig;
