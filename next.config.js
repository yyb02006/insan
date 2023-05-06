/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				hostname: 'img.youtube.com',
			},
		],
	},
};

module.exports = nextConfig;
