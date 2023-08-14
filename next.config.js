const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
module.exports = withBundleAnalyzer({
	reactStrictMode: false,
	env: {
		YOUTUBE_API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
	},
	images: {
		remotePatterns: [
			{
				hostname: 'img.youtube.com',
			},
			{ protocol: 'https', hostname: 'i.ytimg.com' },
			{ protocol: 'https', hostname: 'i.vimeocdn.com' },
		],
	},
});
// i.ytimg.com/vi/qOa0xIE8LWY/default.jpg
