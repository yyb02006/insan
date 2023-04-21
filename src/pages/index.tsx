import Layout from '@/components/layout';
import { cls } from '@/libs/client/utils';
import { MotionValue, Variants, useInView, useSpring } from 'framer-motion';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

interface MouseEventProps {
	mouseX: MotionValue;
	mouseY: MotionValue;
	scrollYProgress: MotionValue<number>;
}

interface HeaderProps extends MouseEventProps {
	inheritRef: MutableRefObject<null>;
}

interface SpringTextProps extends MouseEventProps {}

interface WaveSectionProps {
	scrollYProgress: MotionValue<number>;
}

interface WaveProps {
	scrollYProgress: MotionValue<number>;
	letter: string[];
	startHeight: number;
	endHeigth: number;
	inViewCondition: number;
	stickyCondition: { top: number; height: string };
	waveSec: number;
	waveReverse?: boolean;
	css?: string;
	letterHeightFix?: number;
	index: number;
}

const wave = (sec: number, reverse: boolean = false) => {
	if (reverse) {
		return {
			wave: {
				backgroundPositionX: '-100vw',
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
				backgroundPositionX: `100vw`,
				transition: {
					ease: 'linear',
					duration: sec,
					repeat: Infinity,
				},
			},
		};
	}
};

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

	// useEffect(() => {
	// 	window.addEventListener('scroll', () =>
	// 		console.log({ scrollYProgress: scrollYProgress.get(), scrollY })
	// 	);
	// 	window.removeEventListener('scroll', () =>
	// 		console.log({ scrollYProgress: scrollYProgress.get(), scrollY })
	// 	);
	// }, []);
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

const CircleSection = ({
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
			className='relative bg-[#101010] h-[500vh] mb-[100vh] px-10'
			ref={inheritRef}
		>
			<div className='absolute top-0 h-[80%] '>
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

const Wave = ({
	scrollYProgress,
	letter,
	startHeight,
	endHeigth,
	inViewCondition,
	stickyCondition,
	waveSec,
	waveReverse = false,
	css = '',
	letterHeightFix = -65,
	index,
}: WaveProps) => {
	const y = useTransform(
		scrollYProgress,
		[startHeight, endHeigth],
		[20, letterHeightFix]
	);
	const parent = useRef(null);
	const isInView = useInView(parent, { amount: inViewCondition });
	const visibility = useTransform(scrollYProgress, (value) =>
		value > startHeight ? 'visible' : 'hidden'
	);
	// const test = `top-[${stickyCondition.top}vh] h-[${stickyCondition.height}vh]`;
	return (
		<div
			ref={parent}
			//cls에 stickyCondition 프로퍼티를 올리고 globalcss 갔다가 오면 이부분만 css 적용이 풀린다 ㅈ버그 ㅅㅂ
			className={cls(
				'sticky',
				index === 1 ? 'top-[35vh] h-[100vh]' : '',
				index === 2 ? 'top-[50vh] h-[55vh]' : '',
				index === 3 ? 'top-[65vh] h-[10vh]' : ''
			)}
		>
			<motion.div
				style={{ y, visibility }}
				initial='hidden'
				animate={isInView ? 'visible' : 'hidden'}
				variants={container}
				className={cls(
					css,
					'absolute top-0 flex px-[200px] font-Roboto font-black text-[calc(100px+1vw)] text-[#fafafa] '
				)}
			>
				{waveReverse
					? [...letter].reverse().map((test, idx) => (
							<motion.span variants={child} key={idx}>
								{test === ' ' ? '\u00A0' : test}
							</motion.span>
					  ))
					: letter.map((test, idx) => (
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
				variants={wave(waveSec, waveReverse)}
				className={cls(
					waveReverse ? 'bg-wave-pattern-reverse' : 'bg-wave-pattern',
					'relative w-full max-h-[400px] aspect-[1920/400] bg-[length:100vw]'
				)}
			></motion.div>
		</div>
	);
};

const WavesSection = ({ scrollYProgress }: WaveSectionProps) => {
	const waveProps = useRef([
		{
			index: 1,
			letter: Array.from('Future & Hornesty'),
			startHeight: 0.5,
			endHeigth: 0.6,
			inViewCondition: 0.5,
			stickyCondition: { top: 35, height: '100' },
			waveSec: 12,
			waveReverse: false,
		},
		{
			index: 2,
			letter: Array.from('Intuitive & Trendy'),
			startHeight: 0.6,
			endHeigth: 0.7,
			inViewCondition: 0.5,
			stickyCondition: { top: 50, height: '55' },
			waveSec: 10,
			waveReverse: true,
			css: 'flex-row-reverse right-0',
			letterHeightFix: -60,
		},
		{
			index: 3,
			letter: Array.from('Creative & Emotional'),
			startHeight: 0.7,
			endHeigth: 0.8,
			inViewCondition: 0.5,
			stickyCondition: { top: 65, height: '10' },
			waveSec: 8,
			waveReverse: false,
		},
	]);

	return (
		<motion.div
			animate='wave'
			className='absolute top-[200vh] w-full h-[400vh] pb-[50vh]'
		>
			{waveProps.current.map((prop) =>
				prop.index % 2 === 0 ? (
					<Wave
						key={prop.index}
						scrollYProgress={scrollYProgress}
						letter={prop.letter}
						startHeight={prop.startHeight}
						endHeigth={prop.endHeigth}
						inViewCondition={prop.inViewCondition}
						stickyCondition={prop.stickyCondition}
						waveSec={prop.waveSec}
						waveReverse={prop.waveReverse}
						css={prop.css}
						letterHeightFix={prop.letterHeightFix}
						index={prop.index}
					></Wave>
				) : (
					<Wave
						key={prop.index}
						scrollYProgress={scrollYProgress}
						letter={prop.letter}
						startHeight={prop.startHeight}
						endHeigth={prop.endHeigth}
						inViewCondition={prop.inViewCondition}
						stickyCondition={prop.stickyCondition}
						waveSec={prop.waveSec}
						index={prop.index}
					></Wave>
				)
			)}
		</motion.div>
	);
};

const WorksSection = () => {
	const [range, setRange] = useState(0);
	const vertical = useRef(null);
	const horizental = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: vertical });
	useEffect(() => {
		if (horizental.current?.offsetWidth) {
			setRange((horizental.current.offsetWidth * 3) / 4);
		}
	}, [horizental.current?.offsetWidth]);
	const x = useTransform(scrollYProgress, [0.2, 0.8], [0, -range]);
	useEffect(() => {
		window.addEventListener('scroll', () =>
			console.log({ scrollYProgress: scrollYProgress.get() })
		);
		window.removeEventListener('scroll', () =>
			console.log({ scrollYProgress: scrollYProgress.get() })
		);
	}, []);
	return (
		<div ref={vertical} className='h-[600vh]'>
			<motion.div
				ref={horizental}
				style={{ x }}
				className='sticky top-0 bg-amber-400 text-[200px] w-[400vw]'
			>
				<div className='inline-block justify-center h-[100vh] w-screen bg-purple-500'>
					1
				</div>
				<div className='inline-block justify-center h-[100vh] w-screen bg-green-500'>
					2
				</div>
				<div className='inline-block justify-center h-[100vh] w-screen bg-pink-500'>
					3
				</div>
				<div className='inline-block justify-center h-[100vh] w-screen bg-sky-500'>
					4
				</div>
			</motion.div>
		</div>
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
			onMouseLeave={() => {
				mouseX.set(0);
				mouseY.set(0);
			}}
			className='absolute w-[100vw] h-[100vh] bg-[#13969342]'
		>
			<Layout seoTitle='INSAN'>
				<CircleSection
					inheritRef={target}
					mouseX={mouseX}
					mouseY={mouseY}
					scrollYProgress={scrollYProgress}
				/>
				<WavesSection scrollYProgress={scrollYProgress} />
				<WorksSection />
				<section className='h-[200vh]'></section>
			</Layout>
		</div>
	);
}
