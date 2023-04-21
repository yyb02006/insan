import Layout from '@/components/layout';
import { cls } from '@/libs/client/utils';
import { time } from 'console';
import { reverse } from 'dns';
import { MotionValue, Variants, useInView, useSpring } from 'framer-motion';
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
import {
	MutableRefObject,
	PointerEvent,
	RefObject,
	useEffect,
	useRef,
} from 'react';

interface MouseEventProps {
	mouseX: MotionValue;
	mouseY: MotionValue;
	scrollYProgress: MotionValue<number>;
}

interface HeaderProps extends MouseEventProps {
	inheritRef: MutableRefObject<null>;
}

interface SpringTextProps extends MouseEventProps {}

interface WaveProps {
	scrollYProgress: MotionValue<number>;
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

const wave = (sec: number, reverse: boolean = false) => {
	if (reverse) {
		return {
			wave: {
				backgroundPositionX: '-1920px',
				transition: {
					ease: 'linear',
					duration: sec,
					repeat: Infinity,
				},
			},
		};
	} else {
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
	}
};

const SpringText = ({ mouseX, mouseY, scrollYProgress }: SpringTextProps) => {
	const wordsX = (ratio: number) =>
		useTransform(mouseX, (offset) => offset / ratio);
	const wordsY = (ratio: number) =>
		useTransform(mouseY, (offset) => offset / ratio);
	const elements = useRef([
		{ title: 'Future', yRatio: 2.5, text: 'text-[4.5rem]' },
		{ title: 'Creative', yRatio: 3.5, text: 'text-[5.75rem]' },
		{ title: 'Emotional', yRatio: 6, text: 'text-[7rem]' },
		{
			title: 'Intuitive',
			yRatio: 3.5,
			text: 'text-[5.75rem]',
		},
		{ title: 'Trendy', yRatio: 2.5, text: 'text-[4.5rem]' },
	]);
	const y = useTransform(scrollYProgress, [0.4, 0.5, 0.8], [0, 600, 1000]);

	useEffect(() => {
		window.addEventListener('scroll', () =>
			console.log({ scrollYProgress: scrollYProgress.get(), scrollY })
		);
		window.removeEventListener('scroll', () =>
			console.log({ scrollYProgress: scrollYProgress.get(), scrollY })
		);
	}, []);
	return (
		<>
			<div className='flex border border-[#bababa] justify-center items-center overflow-hidden w-full aspect-square rounded-full'>
				<motion.ul
					style={{ y }}
					className='font-Roboto text-[#efefef] font-extrabold leading-snug text-center '
				>
					{elements.current.map((element, idx) => (
						<motion.li
							key={idx}
							style={{
								x: wordsX(15),
								y: wordsY(element.yRatio),
							}}
							className={element.text}
						>
							{element.title}
						</motion.li>
					))}
				</motion.ul>
			</div>
		</>
	);
};

const Header = ({
	mouseX,
	mouseY,
	scrollYProgress,
	inheritRef,
}: HeaderProps) => {
	const rotate = useTransform(scrollYProgress, [0, 1], [0, 360], {
		clamp: false,
	});
	const y = useTransform(scrollYProgress, [0.1, 0.4], [0, -200]);
	const scale = useTransform(
		scrollYProgress,
		[0.1, 0.4, 0.7, 0.9],
		[1, 0.5, 0.5, 0]
	);
	const logoCircle = useTransform(scrollYProgress, [0.7, 0.9], [1, 0]);
	const circleLineScale = useTransform(
		mouseY,
		(offset) => 1 + Math.abs(offset / 20000)
	);
	/* const baseX = motionValue(0);
	const x = useTransform(baseX, (v) => `${wrap(-40, -60, v)}%`);
	useAnimationFrame((time, delta) => {
		baseX.set(baseX.get() + (2 * delta) / 1000);
	}); */
	const mainCircles = useRef([
		'left-0 top-0 origin-top-left',
		'right-0 top-0 origin-top-right',
		'left-0 bottom-0 origin-bottom-left',
		'right-0 bottom-0 origin-bottom-right',
	]);
	const logoCircles = useRef([
		'top-[-220px] left-[-200px] w-[460px]',
		'top-[-120px] left-[-80px] w-[340px]',
	]);
	return (
		<motion.section
			className='relative bg-[#101010] h-[500vh] px-10'
			ref={inheritRef}
		>
			<div className='h-[80%] absolute'>
				<motion.div style={{ scale: logoCircle }} className='sticky top-0'>
					{logoCircles.current.map((arr, idx) => (
						<motion.div
							key={idx}
							initial='initial'
							animate='bigger'
							variants={logo}
							className={cls(
								arr,
								'absolute border rounded-full border-[#bababa] aspect-square'
							)}
						/>
					))}
				</motion.div>
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
						{mainCircles.current.map((circle, idx) => (
							<motion.li
								key={idx}
								style={{ scale: circleLineScale }}
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
						className='relative bg-[#101010] w-[570px] aspect-square rounded-full flex justify-center items-center'
					>
						<SpringText
							mouseX={mouseX}
							mouseY={mouseY}
							scrollYProgress={scrollYProgress}
						></SpringText>
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

const container: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: (i: number = 1) => ({
		opacity: 1,
		transition: { staggerChildren: 0.08, delayChildren: i * 0 },
	}),
};

const child: Variants = {
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: 'spring',
			damping: 6,
			stiffness: 200,
		},
	},
	hidden: {
		opacity: 1,
		y: 20,
		transition: {
			type: 'spring',
			damping: 6,
			stiffness: 200,
		},
	},
};

const Wave = ({ scrollYProgress }: WaveProps) => {
	const letters = useRef({
		first: Array.from('Future & Hornesty'),
		second: Array.from('Intuitive & Trendy'),
		third: Array.from('Creative & Emotional'),
	});
	const y1 = useTransform(scrollYProgress, [0.5, 0.6], [20, -65]);
	const parent1 = useRef(null);
	const isInView1 = useInView(parent1, { amount: 0.5 });
	const y2 = useTransform(scrollYProgress, [0.6, 0.7], [20, -60]);
	const parent2 = useRef(null);
	const isInView2 = useInView(parent2, { amount: 0.5 });
	const y3 = useTransform(scrollYProgress, [0.7, 0.8], [20, -65]);
	const parent3 = useRef(null);
	const isInView3 = useInView(parent3, { amount: 0.5 });
	const visibility = useTransform(scrollYProgress, (value) =>
		value > 0.5 ? 'visible' : 'hidden'
	);

	return (
		<motion.div
			animate='wave'
			className='absolute top-[200vh] w-full h-[400vh]'
		>
			<div ref={parent1} className='sticky top-[35vh] h-[100vh] '>
				<motion.div
					style={{ y: y1, visibility }}
					initial='hidden'
					animate={isInView1 ? 'visible' : 'hidden'}
					variants={container}
					className='absolute flex px-[200px] font-Roboto font-black top-0 text-[calc(100px+1vw)] text-[#fafafa]'
				>
					{letters.current.first.map((test, idx) => (
						<motion.span variants={child} key={idx}>
							{test === ' ' ? '\u00A0' : test}
						</motion.span>
					))}
				</motion.div>
				{/* <motion.div
					style={{ y, visibility }}
					className='absolute w-full px-[200px] font-Roboto font-black top-0 text-[calc(100px+1vw)] text-[#fafafa] '
				>
					Future & Hornesty
				</motion.div> */}
				<motion.div
					variants={wave(12)}
					className='relative w-full max-h-[400px] aspect-[1920/400] bg-wave-pattern'
				></motion.div>
			</div>
			<div ref={parent2} className='sticky top-[50vh] h-[55vh] '>
				<motion.div
					style={{ y: y2, visibility }}
					initial='hidden'
					animate={isInView2 ? 'visible' : 'hidden'}
					variants={container}
					className='absolute flex flex-row-reverse px-[200px] font-Roboto font-black top-0 right-0 text-[calc(100px+1vw)] text-[#fafafa]'
				>
					{[...letters.current.second].reverse().map((test, idx) => (
						<motion.span variants={child} key={idx}>
							{test === ' ' ? '\u00A0' : test}
						</motion.span>
					))}
				</motion.div>
				{/* <motion.div
					style={{ y: y2, visibility }}
					className='absolute w-full px-[200px] text-right font-Roboto font-black top-0 text-[calc(100px+1vw)] text-[#fafafa] '
				>
					Intuitive & Trendy
				</motion.div> */}
				<motion.div
					variants={wave(10, true)}
					className='relative w-full max-h-[400px] aspect-[1920/400] bg-wave2-pattern'
				></motion.div>
			</div>
			<div ref={parent3} className='sticky top-[65vh] h-[10vh] '>
				<motion.div
					style={{ y: y3, visibility }}
					initial='hidden'
					animate={isInView3 ? 'visible' : 'hidden'}
					variants={container}
					className='absolute flex px-[200px] font-Roboto font-black top-0 text-[calc(100px+1vw)] text-[#fafafa]'
				>
					{letters.current.third.map((test, idx) => (
						<motion.span variants={child} key={idx}>
							{test === ' ' ? '\u00A0' : test}
						</motion.span>
					))}
				</motion.div>
				{/* <motion.div
					style={{ y: y3, visibility }}
					className='absolute w-full px-[200px] font-Roboto font-black top-0 text-[calc(100px+1vw)] text-[#fafafa] '
				>
					Creative & Emotional
				</motion.div> */}
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
	const target = useRef(null);
	const { scrollYProgress } = useScroll({ target });
	const mouseX = useSpring(0, { stiffness: 100 });
	const mouseY = useSpring(0);

	return (
		<div
			onMouseMove={(e) => {
				if (e.pageY < 2200) {
					const offsetX = e.clientX - window.innerWidth / 2;
					const offsetY = e.clientY - window.innerHeight / 2;
					mouseX.set(offsetX);
					mouseY.set(offsetY);
				} else {
					mouseX.set(0);
					mouseY.set(0);
				}
			}}
			onMouseLeave={(e) => {
				mouseX.set(0);
				mouseY.set(0);
			}}
			className='absolute w-[100vw] h-[100vh] bg-[#13969342]'
		>
			<Layout seoTitle='INSAN'>
				<Header
					inheritRef={target}
					mouseX={mouseX}
					mouseY={mouseY}
					scrollYProgress={scrollYProgress}
				/>
				<Wave scrollYProgress={scrollYProgress} />
				<section className='bg-[#101010] h-[3000px]'></section>
			</Layout>
		</div>
	);
}
