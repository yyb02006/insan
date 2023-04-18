import Layout from '@/components/layout';
import { motion, useScroll, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

const logo = {
	bigger: { scale: 1, transition: { duration: 1.2, ease: 'easeOut' } },
	initial: { scale: 0 },
};

const list = {
	initial: {
		scale: 0,
	},
	bigger: {
		scale: 1,
		transition: {
			duration: 1,
			delay: 0.3,
		},
	},
};

export default function Home() {
	const x = useMotionValue(0);
	const y = useTransform(x, [0, 100, 200], [200, 100, 0]);
	const { scrollYProgress, scrollY } = useScroll();
	useEffect(() => {
		console.log(x.get());
	}, [x.get()]);

	return (
		<>
			<Layout seoTitle='INSAN'>
				<motion.div
					initial='initial'
					animate='bigger'
					variants={logo}
					style={{ scale: scrollYProgress }}
					className='fixed top-[-220px] left-[-200px] border rounded-full border-[#bababa] w-[460px] aspect-square'
				/>
				<motion.div
					initial='initial'
					animate='bigger'
					variants={logo}
					className='top-[-120px] left-[-80px] border rounded-full border-[#bababa] w-[340px] aspect-square absolute'
				/>
				<section className='bg-[#101010] min-h-screen px-10 flex justify-center items-center'>
					<div className='w-[640px] aspect-square relative'>
						<motion.ul
							initial='initial'
							animate='bigger'
							variants={list}
							className='w-full aspect-square absolute'
						>
							<motion.li className='left-0 top-0 border rounded-full border-[#bababa] w-[694px] aspect-square absolute z-0' />
							<motion.li className='right-0 top-0 border rounded-full border-[#bababa] w-[694px] aspect-square absolute z-0' />
							<motion.li className='left-0 bottom-0 border rounded-full border-[#bababa] w-[694px] aspect-square absolute z-0' />
							<motion.li className='right-0 bottom-0 border rounded-full border-[#bababa] w-[694px] aspect-square absolute z-0' />
						</motion.ul>
						<motion.div
							animate={{
								scale: [0, 1],
								borderRadius: ['0%', '100%'],
							}}
							transition={{
								duration: 0.7,
							}}
							className='bg-[#efefef] w-[640px] aspect-square rounded-full relative'
						></motion.div>
					</div>
				</section>
				<motion.div
					style={{ x, y }}
					drag='x'
					animate={{ x: [0, 200] }}
					className='w-80 h-80 bg-pink-400'
				/>
				<section className='bg-[#101010] h-[3000px]'></section>
			</Layout>
		</>
	);
}
