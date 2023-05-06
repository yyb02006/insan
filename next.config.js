/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{
				hostname: 'img.youtube.com',
			},
		],
	},
};

module.exports = nextConfig;
