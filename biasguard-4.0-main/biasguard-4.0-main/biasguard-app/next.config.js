/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Allow CommonJS modules and external files
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle external CommonJS modules
      config.externals = config.externals || []
      
      // Allow loading files outside the project
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
  // Enable server-side require for CommonJS modules
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Don't transpile the analyzer wrapper
  transpilePackages: [],
}

module.exports = nextConfig

