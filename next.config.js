const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				hostname: 'img.youtube.com',
			},
			{ protocol: 'https', hostname: 'i.ytimg.com' },
		],
	},
});
// i.ytimg.com/vi/qOa0xIE8LWY/default.jpg
