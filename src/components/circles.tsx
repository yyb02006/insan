import { useRef } from 'react';
import { MotionStyle, Variants, motion, m } from 'framer-motion';
import { cls } from '@/libs/client/utils';

interface DefalutMotion {
	style?: MotionStyle;
	initial?: string;
	animate?: string;
	variants?: Variants;
	css?: string;
}

interface CirclesProps {
	ulMotion?: DefalutMotion;
	liMotion?: DefalutMotion;
	[key: string]: any;
}

/**부모 엘리먼트에 CSS 포지션 값 필수 */
export default function Circles({ ulMotion, liMotion, ...rest }: CirclesProps) {
	const mainCircles = useRef([
		'left-0 top-0 origin-top-left',
		'right-0 top-0 origin-top-right',
		'left-0 bottom-0 origin-bottom-left',
		'right-0 bottom-0 origin-bottom-right',
	]);
	return (
		<m.ul
			style={ulMotion?.style}
			initial={ulMotion?.initial}
			animate={ulMotion?.animate}
			variants={ulMotion?.variants}
			className={cls(
				'w-full aspect-square absolute',
				ulMotion?.css ? ulMotion.css : ''
			)}
			{...rest}
		>
			{mainCircles.current.map((circle, idx) => (
				<m.li
					key={idx}
					style={liMotion?.style}
					initial={liMotion?.initial}
					animate={liMotion?.animate}
					variants={liMotion?.variants}
					className={cls(
						circle,
						'border rounded-full border-[#bababa] aspect-square absolute z-0',
						liMotion?.css ? liMotion?.css : ''
					)}
				/>
			))}
		</m.ul>
	);
}
