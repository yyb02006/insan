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
				Pretendard: ['Pretendard', ...defaultTheme.fontFamily.sans],
				GmarketSans: [
					'var(--font-GMarKetSans)',
					...defaultTheme.fontFamily.sans,
				],
				Roboto: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				'wave-pattern-gradation1-2': `url('../../public/images/wave1_2.svg')`,
				'wave-pattern-gradation2-2': `url('../../public/images/wave2_2.svg')`,
				'wave-pattern-gradation3-2': `url('../../public/images/wave3_2.svg')`,
				'wave-pattern-gradation1-4': `url('../../public/images/wave1_4.svg')`,
				'wave-pattern-gradation2-4': `url('../../public/images/wave2_4.svg')`,
				'wave-pattern-gradation3-4': `url('../../public/images/wave3_4.svg')`,
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
