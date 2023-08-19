import '@/styles/globals.css';
import { LazyMotion, domAnimation } from 'framer-motion';
import type { AppProps } from 'next/app';
import { Roboto } from 'next/font/google';
import { SWRConfig } from 'swr/_internal';
import localFont from 'next/font/local';
import { cls } from '@/libs/client/utils';

const roboto = Roboto({
	weight: ['100', '300', '400', '500', '700', '900'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	variable: '--font-roboto',
});

const gMarKetSans = localFont({
	src: [
		{
			path: '../fonts/GmarketSansLight.woff2',
			weight: '300',
			style: 'normal',
		},
		{
			path: '../fonts/GmarketSansMedium.woff2',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../fonts/GmarketSansBold.woff2',
			weight: '700',
			style: 'normal',
		},
	],
	variable: '--font-GMarKetSans',
});

/* const pretendard = localFont({
	src: [
		{
			path: '../fonts/Pretendard-Thin.woff2',
			weight: '100',
			style: 'normal',
		},
		{
			path: '../fonts/Pretendard-ExtraLight.woff2',
			weight: '200',
			style: 'normal',
		},
		{
			path: '../fonts/Pretendard-Light.woff2',
			weight: '300',
			style: 'normal',
		},
		{
			path: '../fonts/Pretendard-Regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: '../fonts/Pretendard-Medium.woff2',
			weight: '500',
			style: 'normal',
		},
		{
			path: '../fonts/Pretendard-SemiBold.woff2',
			weight: '600',
			style: 'normal',
		},
		{
			path: '../fonts/Pretendard-Bold.woff2',
			weight: '700',
			style: 'normal',
		},
	],
	variable: '--font-Pretendard',
}); */

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig
			value={{ fetcher: (url: string) => fetch(url).then((res) => res.json()) }}
		>
			<LazyMotion features={domAnimation}>
				<main className={cls(roboto.variable, gMarKetSans.variable)}>
					<Component {...pageProps} />
				</main>
			</LazyMotion>
		</SWRConfig>
	);
}
