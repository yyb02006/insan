import { useRef } from 'react';
import { MotionStyle, Variants, motion } from 'framer-motion';
import { cls } from '@/libs/client/utils';

interface defalutMotion {
	style?: MotionStyle;
	initial?: string;
	animate?: string;
	variants?: Variants;
	css?: string;
}

interface CirclesProps {
	ulMotion?: defalutMotion;
	liMotion?: defalutMotion;
	[key: string]: any;
}

export default function Circles({ ulMotion, liMotion, ...rest }: CirclesProps) {
	const mainCircles = useRef([
		'left-0 top-0 origin-top-left',
		'right-0 top-0 origin-top-right',
		'left-0 bottom-0 origin-bottom-left',
		'right-0 bottom-0 origin-bottom-right',
	]);
	return (
		<motion.ul
			style={ulMotion?.style}
			initial={ulMotion?.initial}
			animate={ulMotion?.animate}
			variants={ulMotion?.variants}
			className={ulMotion?.css}
			{...rest}
		>
			{mainCircles.current.map((circle, idx) => (
				<motion.li
					key={idx}
					style={liMotion?.style}
					initial={liMotion?.initial}
					animate={liMotion?.animate}
					variants={liMotion?.variants}
					className={cls(circle, liMotion?.css ? liMotion?.css : '')}
				/>
			))}
		</motion.ul>
	);
}
