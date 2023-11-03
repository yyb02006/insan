import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="ko">
			<Head>
				<link rel="icon" href="/insan_favicon.ico" />
				<meta
					name="google-site-verification"
					content="2xWAj__7dmJHQCCBs01Y9G7NUZ1uV2tOhnHDhwsSrN0"
				/>
			</Head>
			<body className="scrollbar-hide text-[#eaeaea]">
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
