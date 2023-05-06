import { useScroll, useTransform, m } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Test() {
	const test = useRef<HTMLDivElement>(null);
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start start', 'end end'],
	});
	const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);
	const [inner, setInner] = useState(0);
	useEffect(() => {
		setInner(window.innerWidth);
	}, []);
	return (
		<div className='relative w-full h-[500vh] bg-red-500'>
			<div className='w-full overflow-x-hidden'>
				<div className='w-[1920px] h-[200px] bg-green-500'></div>
			</div>
			{/* <div className='w-[1280px] h-[200px] bg-pink-500'></div>
			<div className='top-0 w-[768px] h-[200px] bg-indigo-500'>ggggggggggg</div>
			<div className='w-[640px] h-[200px] bg-amber-500'></div> */}
			<div ref={test} className='w-full h-[200px] bg-sky-500 text-5xl'>
				{inner > 5 ? 'big' : 'small'}
			</div>
			<div
				ref={ref}
				className='w-full h-[200vh] flex justify-center items-start bg-indigo-500'
			>
				<m.div
					initial={{ scale: 0 }}
					style={{ scale }}
					className='sticky top-0 w-[400px] aspect-square rounded-full border border-[#101010]'
				/>
				<m.div
					initial={{ scale: 0 }}
					style={{ scale }}
					className='sticky top-0 w-[400px] aspect-square rounded-full border border-[#101010]'
				/>
				<m.div
					initial={{ scale: 0 }}
					style={{ scale }}
					className='sticky top-0 w-[400px] aspect-square rounded-full border border-[#101010]'
				/>
				<m.div
					initial={{ scale: 0 }}
					style={{ scale }}
					className='sticky top-0 w-[400px] aspect-square rounded-full border border-[#101010]'
				/>
			</div>
		</div>
	);
}
