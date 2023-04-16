import { cls } from '@/libs/client/utils';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
	weight: ['100', '300', '400', '500', '700', '900'],
	style: ['normal', 'italic'],
	subsets: ['latin'],
	variable: '--font-roboto',
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<main className={roboto.variable}>
			<Component {...pageProps} />
		</main>
	);
}
