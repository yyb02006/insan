import Layout from '@/components/layout';
import { cls } from '@/libs/client/utils';
import { time } from 'console';
import { reverse } from 'dns';
import { MotionValue, useSpring } from 'framer-motion';
import {
	motion,
	useScroll,
	useMotionValue,
	useTransform,
	useMotionValueEvent,
	useWillChange,
	useDragControls,
	useAnimate,
	useAnimationFrame,
	motionValue,
	wrap,
} from 'framer-motion';
import { PointerEvent, useEffect, useRef } from 'react';

interface MouseEventProps {
	mouseX: MotionValue;
	mouseY: MotionValue;
}

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
			duration: 0.7,
			delay: 0.3,
		},
	},
};

const wave = (sec: number) => {
	return {
		wave: {
			backgroundPositionX: '1920px',
			transition: {
				ease: 'linear',
				duration: sec,
				repeat: Infinity,
			},
		},
	};
};

const SpringText = ({ mouseX, mouseY }: MouseEventProps) => {
	let firstWordX = (ratio: number) =>
		useTransform(mouseX, (value) => value / ratio);
	let firstWordY = (ratio: number) =>
		useTransform(mouseY, (value) => value / ratio);
	// let secondWordX = useTransform(mouseX, [], []);
	// let secondWordY = useTransform(mouseY, [], []);
	const elements = useRef([
		{ title: 'Future', yRatio: 2 },
		{ title: 'Creative', yRatio: 3 },
		{ title: 'Emotional', yRatio: 6 },
		{ title: 'Intuitive', yRatio: 3 },
		{ title: 'Trendy', yRatio: 2 },
	]);
	console.log(elements);

	return (
		<>
			<div className='flex justify-center items-center overflow-hidden bg-green-400 w-full aspect-square rounded-full'>
				<ul className='font-Roboto font-extrabold text-[6.5rem] leading-relaxed text-center '>
					{elements.current.map((element, idx) => (
						<motion.li
							key={idx}
							style={{ x: firstWordX(9), y: firstWordY(element.yRatio) }}
						>
							{element.title}
						</motion.li>
					))}
				</ul>
			</div>
		</>
	);
};

const Header = ({ mouseX, mouseY }: MouseEventProps) => {
	const target = useRef(null);
	const { scrollYProgress } = useScroll({ target });
	const rotate = useTransform(scrollYProgress, [0, 1], [0, 360], {
		clamp: false,
	});
	const y = useTransform(scrollYProgress, [0.1, 0.4], [0, -200]);
	const scale = useTransform(
		scrollYProgress,
		[0.1, 0.4, 0.8, 1],
		[1, 0.5, 0.5, 0]
	);
	useEffect(() => {
		window.addEventListener('scroll', () =>
			console.log({ scrollYProgress: scrollYProgress.get(), scrollY })
		);
		window.removeEventListener('scroll', () =>
			console.log({ scrollYProgress: scrollYProgress.get(), scrollY })
		);
	}, []);
	/* const baseX = motionValue(0);
	const x = useTransform(baseX, (v) => `${wrap(-40, -60, v)}%`);
	useAnimationFrame((time, delta) => {
		baseX.set(baseX.get() + (2 * delta) / 1000);
	}); */
	const circles = useRef([
		'left-0 top-0',
		'right-0 top-0',
		'left-0 bottom-0',
		'right-0 bottom-0',
	]);
	return (
		<motion.section
			ref={target}
			className='relative bg-[#101010] h-[500vh] px-10'
		>
			<div className='h-[30%] absolute'>
				<div className='sticky top-0'>
					<motion.div
						initial='initial'
						animate='bigger'
						variants={logo}
						className='absolute top-[-220px] left-[-200px] border rounded-full border-[#bababa] w-[460px] aspect-square'
					/>
					<motion.div
						initial='initial'
						animate='bigger'
						variants={logo}
						className='absolute top-[-120px] left-[-80px] border rounded-full border-[#bababa] w-[340px] aspect-square'
					/>
				</div>
			</div>
			<div className='h-full flex justify-center items-start '>
				<motion.div
					style={{ scale, y }}
					className='sticky top-0 h-[100vh] flex items-center '
				>
					<motion.ul
						style={{ rotate }}
						initial='initial'
						animate='bigger'
						variants={list}
						className='w-full aspect-square absolute'
					>
						{circles.current.map((circle, idx) => (
							<li
								key={idx}
								className={cls(
									circle,
									'border rounded-full border-[#bababa] w-[620px] aspect-square absolute z-0'
								)}
							/>
						))}
					</motion.ul>
					<motion.div
						animate={{
							scale: [0, 1],
							borderRadius: ['0%', '100%'],
						}}
						transition={{
							duration: 0.7,
						}}
						className='relative bg-[#efefef] w-[570px] aspect-square rounded-full flex justify-center items-center'
					>
						<SpringText mouseX={mouseX} mouseY={mouseY}></SpringText>
						{/* <motion.div
							style={{ x }}
							className='whitespace-nowrap absolute left-0 m-w-[100vw] text-[#101010] font-normal font-Roboto text-[132px]'
						>
							<span className='text-stroke'>
								Emotional Creative Trendy Emotional Creative Trendy Emotional
								Creative Trendy Emotional Creative Trendy Emotional Creative
								Trendy
							</span>
						</motion.div> */}
					</motion.div>
				</motion.div>
			</div>
		</motion.section>
	);
};

const WaveSection = () => {
	return (
		<motion.div
			animate='wave'
			className='absolute top-[200vh] w-full h-[300vh]'
		>
			<div className='sticky top-[40vh] h-[60vh] '>
				<motion.div
					variants={wave(12)}
					className='relative w-full max-h-[400px] aspect-[1920/400] bg-wave-pattern'
				></motion.div>
			</div>
			<div className='sticky top-[50vh] h-[50vh] '>
				<motion.div
					variants={wave(10)}
					className='relative w-full max-h-[400px] aspect-[1920/400] bg-wave2-pattern'
				></motion.div>
			</div>
			<div className='sticky top-[60vh] h-[40vh] '>
				<motion.div
					variants={wave(8)}
					className='relative w-full max-h-[400px] aspect-[1920/400] bg-wave-pattern'
				></motion.div>
			</div>
		</motion.div>
	);
};

export default function Home() {
	// const [scope, animate] = useAnimate();
	// useEffect(() => {
	// 	animate(scope.current, { opacity: 0 }, { duration: 4 });
	// }, []);
	let mouseX = useSpring(0, { stiffness: 100 });
	let mouseY = useSpring(0);
	return (
		<div
			onMouseMove={(e) => {
				let offsetX = e.clientX - window.innerWidth / 2;
				let offsetY = e.clientY - window.innerHeight / 2;
				mouseX.set(offsetX);
				mouseY.set(offsetY);
			}}
			onMouseLeave={(e) => {
				mouseX.set(0);
				mouseY.set(0);
			}}
			className='absolute w-[100vw] h-[100vh] bg-[#13969342]'
		>
			<Layout seoTitle='INSAN'>
				<Header mouseX={mouseX} mouseY={mouseY} />
				<WaveSection />
				<section className='bg-[#101010] h-[3000px]'></section>
			</Layout>
		</div>
	);
}
