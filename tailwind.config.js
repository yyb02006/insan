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
				SCoreDream: ['SCoreDream', ...defaultTheme.fontFamily.sans],
				Pretendard: ['Pretendard', ...defaultTheme.fontFamily.sans],
				GmarketSans: ['GmarketSans', ...defaultTheme.fontFamily.sans],
				Roboto: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				'wave-pattern': `url('../../public/images/wave.svg')`,
				'wave2-pattern': `url('../../public/images/wave2.svg')`,
			},
		},
	},
	plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
};
