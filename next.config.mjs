/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "sapphire-obliged-canidae-626.mypinata.cloud",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
