/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  output: "standalone",
  distDir: "dist",
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
  async rewrites() {
    return [
      {
        source: "/dev-cdn-proxy/:path*",
        // Destination is the base URL of your CDN from the error message
        destination: "https://cdn.lissenprod.lissen.live/:path*",
      },
    ];
  },
};

export default nextConfig;
