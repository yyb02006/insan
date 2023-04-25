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
		colors: {
			transparent: 'transparent',
			palettered: '#FF4A5D',
		},
		extend: {
			fontFamily: {
				SCoreDream: ['SCoreDream', ...defaultTheme.fontFamily.sans],
				Pretendard: ['Pretendard', ...defaultTheme.fontFamily.sans],
				GmarketSans: ['GmarketSans', ...defaultTheme.fontFamily.sans],
				Roboto: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				'wave-pattern': `url('../../public/images/wave.svg')`,
				'wave-pattern-reverse': `url('../../public/images/wave2.svg')`,
			},
			animation: {
				'spin-slow': 'spin 10s linear infinite',
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
};
