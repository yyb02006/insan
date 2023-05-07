import { useAnimate, useInView } from 'framer-motion';
import { useEffect } from 'react';
import Link from 'next/link';
import Circles from './circles';
import { cls } from '@/libs/client/utils';

export default function OutroSection() {
	const [scope, animate] = useAnimate();
	const isInView = useInView(scope, { amount: 0.3 });
	useEffect(() => {
		if (isInView) {
			animate(scope.current, { scale: 1 }, { duration: 0.5 });
		} else {
			animate(scope.current, { scale: 0.5 });
		}
	}, [isInView, scope, animate]);
	const onCircleEnter = () => {
		animate('.Container', { scale: 1.2 }, { duration: 0.5 });
		animate('.Text', { color: '#eaeaea' }, { duration: 0.5 });
	};
	const onCircleLeave = () => {
		animate('.Container', { scale: 1 }, { duration: 0.5 });
		animate('.Text', { color: '#101010' }, { duration: 0.2 });
	};
	return (
		<div className='mt-[30vh] h-[100vh] flex justify-center items-center'>
			<Link href='/work'>
				<div
					ref={scope}
					onMouseEnter={onCircleEnter}
					onMouseLeave={onCircleLeave}
					className='relative w-[55vw] sm:h-[70vh] aspect-square flex justify-center items-center rounded-full'
				>
					<div className='Container absolute w-full sm:w-auto sm:h-full aspect-square'>
						<Circles
							ulMotion={{
								css: cls(
									isInView ? 'animate-spin-slow' : 'animate-spin-slow pause',
									'transition-transform'
								),
							}}
							liMotion={{ css: 'w-[calc(20px+100%)] sm:w-[calc(50px+100%)]' }}
						/>
					</div>
					<span
						style={{ WebkitTextStroke: '1px #eaeaea' }}
						className='Text relative text-[#101010] text-[6rem] sm:text-[10rem] font-GmarketSans font-bold'
					>
						INSAN
					</span>
				</div>
			</Link>
		</div>
	);
}
