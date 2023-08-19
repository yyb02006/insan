import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */

module.exports = {
	mode: 'jit',
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/app/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				Pretendard: ['var(--font-Pretendard)', ...defaultTheme.fontFamily.sans],
				GmarketSans: [
					'var(--font-GMarKetSans)',
					...defaultTheme.fontFamily.sans,
				],
				Roboto: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				'wave-pattern': `url('../../public/images/wave.svg')`,
				'wave-pattern-reverse': `url('../../public/images/wave2.svg')`,
			},
			animation: {
				'spin-slow': 'spin 10s linear infinite',
				'spin-middle': 'spin 5s linear infinite',
			},
			colors: {
				transparent: 'transparent',
				palettered: '#FF4A5D',
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
};
