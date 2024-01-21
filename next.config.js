/** @type {import('next').NextConfig} */
const prodPath = 'https://resolutions-nqtoxwzj1-bryan-jiangs-projects.vercel.app'
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

module.exports = nextConfig
