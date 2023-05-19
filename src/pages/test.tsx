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
		<div className='bg-black text-white flex justify-center'>
			<div>mail:address</div>
			<div>desc:description</div>
		</div>
	);
}
