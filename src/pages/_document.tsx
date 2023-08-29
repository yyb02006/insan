import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='ko'>
			<Head>
				<link rel='icon' href='/insan_favicon.ico' />
			</Head>
			<body className='scrollbar-hide text-[#eaeaea]'>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
