import { cls } from '@/libs/client/utils';
import '@/styles/globals.css';
import { LazyMotion, domAnimation } from 'framer-motion';
import type { AppProps } from 'next/app';
import { Roboto } from 'next/font/google';
import { SWRConfig } from 'swr/_internal';

const roboto = Roboto({
	weight: ['100', '300', '400', '500', '700', '900'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	variable: '--font-roboto',
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SWRConfig
			value={{ fetcher: (url: string) => fetch(url).then((res) => res.json()) }}
		>
			<LazyMotion features={domAnimation}>
				<main className={roboto.variable}>
					<Component {...pageProps} />
				</main>
			</LazyMotion>
		</SWRConfig>
	);
}
