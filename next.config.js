/** @type {import('next').NextConfig} */
const prodPath = 'https://resolutions-ochre.vercel.app/';
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${prodPath}/api/:path*`,
            },
        ];
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        }
    );

    return config;
  },
}

module.exports = nextConfig;
