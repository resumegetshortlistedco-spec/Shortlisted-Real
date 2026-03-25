/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/rewrite', destination: '/' },
      { source: '/jump', destination: '/' },
      { source: '/build', destination: '/' },
      { source: '/review', destination: '/' },
    ];
  },
};

module.exports = nextConfig;
