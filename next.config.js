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
}

module.exports = nextConfig;
