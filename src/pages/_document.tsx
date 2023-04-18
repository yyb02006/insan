import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang='ko'>
			<Head />
			<body className='scrollbar-hide'>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
