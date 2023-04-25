import Chevron from '@/components/chevron';
import Circles from '@/components/circles';
import Layout from '@/components/layout';
import { cls } from '@/libs/client/utils';
import {
	MotionValue,
	Variants,
	useInView,
	useSpring,
	motion,
	useScroll,
	useTransform,
	useAnimate,
	usePresence,
	AnimatePresence,
} from 'framer-motion';
import Link from 'next/link';
import {
	MouseEvent,
	MutableRefObject,
	useEffect,
	useRef,
	useState,
} from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';

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
	inheritRef: MutableRefObject<null>;
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

interface SnsLinkProps {
	scrollYProgress: MotionValue<number>;
	isInView?: boolean;
}

interface VideoProps {
	videoId: string;
}

interface VideoContainerProps {
	index: number;
	title: string;
	role: string;
	description: string;
	date: string;
	videoId: string;
}

interface VideoSectionIndicatorProps {
	scrollYProgress: MotionValue<number>;
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

const sideCircle: Variants = {
	visible: { scale: 1, transition: { duration: 1.2, ease: 'easeOut' } },
	hidden: { scale: 0 },
};

const list: Variants = {
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

const snsAnchor: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.2 },
	},
	disappear: {
		transition: { staggerChildren: 0.1 },
	},
};

const snsList: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: { x: [50, 0], opacity: [0, 1], transition: { duration: 0.4 } },
	disappear: {
		x: [null, 50],
		opacity: [null, 0],
		transition: { duration: 0.4 },
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
	const logoCircles = useRef([
		'top-[-220px] left-[-200px] w-[460px]',
		'top-[-120px] left-[-80px] w-[340px]',
	]);
	return (
		<motion.section
			className='relative h-[500vh] mb-[100vh] px-10'
			ref={inheritRef}
		>
			<div className='absolute top-0 h-[80%]'>
				<motion.div style={{ scale: logoCircle }} className='sticky top-0'>
					{logoCircles.current.map((arr, idx) => (
						<motion.div
							key={idx}
							initial='hidden'
							animate='visible'
							variants={sideCircle}
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
					className='sticky top-0 h-[100vh] flex items-center'
				>
					<Circles
						ulMotion={{
							style: { rotate },
							initial: 'initial',
							animate: 'bigger',
							variants: list,
						}}
						liMotion={{
							style: { scale: circleLineScale },
							css: 'w-[620px]',
						}}
					/>
					<motion.div
						animate={{
							scale: [0, 1],
							borderRadius: ['0%', '100%'],
						}}
						transition={{
							duration: 0.7,
						}}
						className='relative bg-[#101010] w-[570px] scale-0 aspect-square rounded-full flex justify-center items-center'
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

const WavesSection = ({ scrollYProgress, inheritRef }: WaveSectionProps) => {
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
			ref={inheritRef}
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

const Video = ({ videoId }: VideoProps) => {
	const ref = useRef(null);
	const isInView = useInView(ref);
	const [thumnail, setThumnail] = useState(true);
	const [video, setVideo] = useState<YouTubeEvent>();
	const [videoState, setVideoState] = useState<number>(-1);
	const onVideoReady: YouTubeProps['onReady'] = (e) => {
		setVideo(e);
	};
	const onVideoStateChange: YouTubeProps['onStateChange'] = (e) => {
		setVideoState(e.data);
	};
	useEffect(() => {
		if (!thumnail && video && (videoState < 1 || videoState === 2)) {
			video.target.playVideo();
		} else if (thumnail && video && videoState === 1) {
			video.target.pauseVideo();
		} else if (video && videoState === 0) {
			video.target.stopVideo();
		}
		if (video && videoState === 1) {
		}
	}, [thumnail, video, videoState]);
	useEffect(() => {
		if (!isInView && videoState === 1) {
			setThumnail((p) => !p);
		}
	}, [isInView, videoState]);
	/* controls.start와 controls.stop을 반복하면 점점 느려지는 버그
	const ref = useRef<HTMLUListElement | null>(null);
	const controls = useAnimationControls();
	useEffect(() => {
		if (videoState === 1) {
			controls.start('start');
		}
		if (videoState !== 1) {
			controls.stop();
			return;
		}
	}, [videoState]); */
	return (
		<div ref={ref} className='relative'>
			<div className='Wrapper absolute w-full aspect-square'>
				<Circles
					ulMotion={{
						css: cls(
							videoState === 1
								? 'animate-spin-slow'
								: 'animate-spin-slow pause',
							'transition-all'
						),
					}}
					liMotion={{
						css: 'w-[calc(50px+100%)]',
					}}
				/>
			</div>
			<motion.div className='relative bg-[#101010] w-full aspect-square rounded-full flex justify-center items-center overflow-hidden'>
				<div className='h-full aspect-video'>
					<YouTube
						videoId={videoId}
						opts={{
							width: '100%',
							height: '100%',
							playerVars: { rel: 0, modestbranding: 1 },
							host: 'https://www.youtube-nocookie.com',
							origin: 'http://localhost:3000',
						}}
						onReady={onVideoReady}
						onStateChange={onVideoStateChange}
						className='relative h-full aspect-video pointer-events-none'
					/>
				</div>
				<div
					onClick={() => {
						if (video) {
							setThumnail((p) => !p);
						}
					}}
					className={cls(
						thumnail
							? 'opacity-100'
							: 'opacity-0 transition-opacity duration-300',
						'absolute top-0 h-full aspect-video cursor-pointer'
					)}
				>
					<img
						src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
						alt='1'
						className='absolute h-full aspect-video'
					/>
					<div className='absolute top-0 h-full aspect-video bg-[#202020] opacity-[35%]' />
				</div>
			</motion.div>
		</div>
	);
};

const VideoContainer = ({
	index,
	title,
	role,
	description,
	date,
	videoId,
}: VideoContainerProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { amount: 0.5 });
	const [textScope, textAnimate] = useAnimate();
	const [videoScope, videoAnimate] = useAnimate();
	const motionInfos = [
		{ kind: '.Index', move: 'up', range: 100 },
		{ kind: '.Title', move: 'down', range: 100 },
		{ kind: '.Role', move: 'down', range: 100 },
		{ kind: '.Desc', move: 'up', range: 100 },
		{ kind: '.Date', move: 'up', range: 100 },
	];
	const textMotion = (reverse = false) => {
		motionInfos.forEach((motionInfo) => {
			textAnimate(
				motionInfo.kind,
				{
					opacity: reverse ? [1, 0] : [0, 1],
					y: reverse
						? [
								0,
								motionInfo.move === 'up' ? motionInfo.range : -motionInfo.range,
						  ]
						: [
								motionInfo.move === 'up' ? motionInfo.range : -motionInfo.range,
								0,
						  ],
				},
				{ duration: 0.6, ease: 'easeOut' }
			);
		});
	};
	useEffect(() => {
		if (isInView) {
			videoAnimate(
				'.Wrapper',
				{ scale: [0.8, 1] },
				{ duration: 0.4, ease: 'easeOut' }
			);
			textMotion();
		} else {
			videoAnimate(
				'.Wrapper',
				{ scale: [1, 0.8] },
				{ duration: 0.4, ease: 'easeIn' }
			);
			textMotion(true);
		}
	}, [isInView]);
	return (
		<div ref={ref} className='h-[100vh] w-screen'>
			<div className='relative h-[100vh] w-screen flex justify-start items-center'>
				<div className='absolute w-full h-full flex items-center'>
					<img
						src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
						alt='1'
						className='relative h-[80vh] aspect-video'
					/>
					<div className='absolute top-0 w-full h-full bg-[#101010] opacity-95' />
				</div>
				<div ref={videoScope} className='w-[600px] ml-[calc(160px+10vw)]'>
					<Video videoId={videoId} />
				</div>
				<div
					ref={textScope}
					className='font-Roboto font-thin absolute pt-[80px] pb-[140px] flex flex-col justify-between items-end text-[100px] text-[#eaeaea] top-0 left-0 w-[80vw] h-full aspect-square pointer-events-none'
				>
					<div className='flex justify-end items-center'>
						<div
							className={cls(
								index === 1 ? '-mr-[60px]' : '',
								'Index font-extrabold text-[22.5rem] leading-[0.73] text-[#1E1E1E] text-stroke-darker'
							)}
						>
							{index}
						</div>
						<div className='Title font-GmarketSans font-bold absolute'>
							{title}
						</div>
					</div>
					<div className='text-[#9a9a9a] text-5xl -mt-20 flex flex-col items-end'>
						<div className='Role -ml-20'>{role}</div>
						<div className='Desc font-GmarketSans font-medium text-base text-[#f4f4f4] -mt-3'>
							{description}
						</div>
					</div>
					<div className='Date text-2xl'>{date}</div>
				</div>
			</div>
		</div>
	);
};

const VideosSection = () => {
	const dummyDatas = [
		{
			index: 1,
			title: 'EMOTIONAL',
			role: 'Director',
			description: '확장과 재창조, 창작의 결과물',
			date: '2023.2.22',
			videoId: 'd4I-0Zv1Lv8',
		},
		{
			index: 2,
			title: 'TRENDY',
			role: 'Camera',
			description: '엔터테인먼트와 현실의 연결',
			date: '2023.2.23',
			videoId: 'CWBy5PyyMyw',
		},
		{
			index: 3,
			title: 'CREATIVE',
			role: 'Art Director',
			description: '확장과 재창조, 창작의 결과물',
			date: '2023.2.24',
			videoId: 'Kzgid8FIjKc',
		},
		{
			index: 4,
			title: 'INTUITIVE',
			role: 'Lead Developer',
			description: '영감을 주고 받은 기록',
			date: '2023.2.25',
			videoId: 'AuXYLGyEajg',
		},
	];
	const [range, setRange] = useState(0);
	const vertical = useRef(null);
	const horizental = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: vertical });
	useEffect(() => {
		if (horizental.current?.offsetWidth) {
			setRange((horizental.current.offsetWidth * 3) / 4);
		}
	}, [horizental.current?.offsetWidth]);
	const x = useTransform(scrollYProgress, [0.1, 0.9], [0, -range]);
	// useEffect(() => {
	// 	window.addEventListener('scroll', () => console.log(scrollYProgress.get()));
	// 	window.removeEventListener('scroll', () => {});
	// }, []);

	/**inner를 100vh만큼 줄이고 마진으로 인식범위 최적화 */
	const inner = useRef(null);
	const isInView = useInView(inner, { margin: '0% 0% -100% 0%' });
	return (
		<div ref={vertical} className='relative h-[600vh]'>
			<div
				ref={inner}
				className='top-0 absolute h-[calc(100%-100vh)] w-full'
			></div>
			<motion.div
				ref={horizental}
				style={{ x }}
				className='sticky top-0 text-[200px] h-[100vh] w-[400vw] flex'
			>
				{dummyDatas.map((data) => (
					<VideoContainer
						key={data.index}
						index={data.index}
						title={data.title}
						role={data.role}
						description={data.description}
						date={data.date}
						videoId={data.videoId}
					/>
				))}
			</motion.div>
			<AnimatePresence>
				{isInView ? (
					<VideoSectionIndicator scrollYProgress={scrollYProgress} />
				) : null}
			</AnimatePresence>
		</div>
	);
};

const VideoSectionIndicator = ({
	scrollYProgress,
}: VideoSectionIndicatorProps) => {
	const [isPresent, safeToRemove] = usePresence();
	const [indicator, animate] = useAnimate();
	const height = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
	// const opacity = useTransform(
	// 	scrollYProgress,
	// 	[
	// 		0.13, 0.15, 0.24, 0.26, 0.39, 0.41, 0.5, 0.52, 0.65, 0.67, 0.76, 0.78,
	// 		0.91,
	// 	],
	// 	[1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
	// );
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await animate(
					indicator.current,
					{ x: 60, opacity: 1 },
					{ duration: 0.5 }
				);
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				await animate(
					indicator.current,
					{ x: 0, opacity: 0 },
					{ duration: 0.2 }
				);
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent]);
	return (
		<motion.div
			ref={indicator}
			className='fixed left-0 top-0 h-full w-[28px] flex items-center '
		>
			<div className='relative bg-[#202020] py-4 box-content rounded-full h-[60vh] w-full flex flex-col justify-between items-center'>
				<div className='border border-[#707070] w-[4px] h-[30vh] rounded-full absolute top-0 mt-4' />
				<div className='h-[30vh]'>
					<motion.div
						style={{ height }}
						className='relative w-[4px] bg-[#FE4A5D] rounded-full'
					/>
				</div>
				<div
					className='tracking-[1rem] text-lg text-[#eaeaea]'
					style={{ writingMode: 'vertical-rl' }}
				>
					Artist
				</div>
			</div>
		</motion.div>
	);
};

const SnsLink = ({ scrollYProgress, isInView }: SnsLinkProps) => {
	const scale = useTransform(scrollYProgress, [0.25, 0.45], [1, 0]);
	const visibility = useTransform(scrollYProgress, (value) => {
		if (value > 0.3) {
			return 'hidden';
		} else {
			return 'visible';
		}
	});
	return (
		<motion.div
			style={{ visibility }}
			className='fixed w-full h-full flex justify-end items-end text-[#efefef]'
		>
			<motion.div
				style={{ scale }}
				initial='hidden'
				animate='visible'
				variants={sideCircle}
				className='absolute w-[260px] aspect-square rounded-full border border-[#bababa] -bottom-12 -right-10 origin-bottom-right'
			/>
			<motion.ul
				animate={!isInView ? 'visible' : 'disappear'}
				variants={snsAnchor}
				className='pr-[60px] pb-8 flex flex-col items-end font-Roboto font-light text-lg gap-2'
			>
				{['Instagram', 'Vimeo', 'YouTube'].map((arr, idx) => (
					<motion.li key={idx} variants={snsList}>
						<Link href={''}>{arr}</Link>
					</motion.li>
				))}
			</motion.ul>
		</motion.div>
	);
};

const TextSection = () => {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});
	const y: MotionValue[] = [];
	const opacity: MotionValue[] = [];
	const setTiming = (start: number, end: number, term: number) => {
		for (let i = 0; i < 7; i++) {
			y.push(
				useTransform(
					scrollYProgress,
					[0.1 * (i * term + start), 0.1 * (i * term + end)],
					[100, 0]
				)
			);
			opacity.push(
				useTransform(
					scrollYProgress,
					[0.1 * (i * term + start), 0.1 * (i * term + end)],
					[0, 1]
				)
			);
		}
	};
	setTiming(1, 2, 5 / 8);
	const scale = useTransform(scrollYProgress, [0, 0.4], [0.5, 1]);
	const rotate = useTransform(scrollYProgress, [0, 0.4], [90, 0]);
	return (
		<section
			ref={ref}
			className='relative mt-[50vh] h-[100vh] flex justify-center'
		>
			<motion.div
				style={{ scale, rotate }}
				className='absolute -right-[40vh] top-8 h-[80vh] aspect-square'
			>
				<Circles
					liMotion={{
						css: 'w-[calc(50px+100%)]',
					}}
				/>
			</motion.div>
			<div className='font-GmarketSans font-bold leading-[1.1] text-[#101010] text-[10rem] pr-40'>
				<motion.div
					style={{ y: y[0], opacity: opacity[0] }}
					className='text-stroke-darker'
				>
					Moves
				</motion.div>
				<div className='flex flex-col text-[5rem] text-[#dadada] -mt-6 -mb-2 -ml-16'>
					<motion.span style={{ y: y[1], opacity: opacity[1] }}>
						좋은 영상을 <span className='font-extralight'>만든다는 것은,</span>
					</motion.span>
					<motion.span style={{ y: y[2], opacity: opacity[2] }}>
						당신께 감동을 <span className='font-extralight'>드린다는 것.</span>
					</motion.span>
				</div>
				<motion.div
					style={{ y: y[3], opacity: opacity[3] }}
					className='text-stroke-darker'
				>
					Client
				</motion.div>
				<div className='relative flex flex-col text-[5rem] text-[#dadada] -mt-6 -mb-2 -ml-16'>
					<motion.div
						style={{ y: y[6], opacity: opacity[6] }}
						className='absolute text-stroke-darker text-[10rem] text-[#101010] -left-16'
					>
						&
					</motion.div>
					<motion.span
						style={{ y: y[4], opacity: opacity[4] }}
						className='relative'
					>
						상상이 현실이 <span className='font-extralight'>되는 감동을,</span>
					</motion.span>
					<motion.span
						style={{ y: y[5], opacity: opacity[5] }}
						className='relative'
					>
						더 나은 컨텐츠로의 <span className='font-extralight'>영감을.</span>
					</motion.span>
				</div>
				<motion.div
					style={{ y: y[6], opacity: opacity[6] }}
					className='text-stroke-darker'
				>
					Customer
				</motion.div>
			</div>
		</section>
	);
};

const OutroSection = () => {
	const [scope, animate] = useAnimate();
	const isInView = useInView(scope, { amount: 0.3 });
	useEffect(() => {
		if (isInView) {
			animate(scope.current, { scale: 1 }, { duration: 0.5 });
		} else {
			animate(scope.current, { scale: 0.5 });
		}
	}, [isInView]);
	const onCircleOver = () => {
		animate('.Container', { scale: 1.2 }, { duration: 0.5 });
		animate('.Text', { color: '#eaeaea' }, { duration: 0.5 });
	};
	const onCircleOut = () => {
		animate('.Container', { scale: 1 }, { duration: 0.5 });
		animate('.Text', { color: '#101010' }, { duration: 0.2 });
	};
	return (
		<div className='mt-[30vh] h-[100vh] flex justify-center items-center'>
			<div
				ref={scope}
				onMouseOver={onCircleOver}
				onMouseOut={onCircleOut}
				className='relative h-[70vh] aspect-square flex justify-center items-center'
			>
				<div className='Container absolute h-full aspect-square'>
					<Circles
						ulMotion={{
							css: cls(
								isInView ? 'animate-spin-slow' : 'animate-spin-slow pause',
								'transition-all'
							),
						}}
					/>
				</div>
				<span className='Text text-stroke-light relative text-[#101010] text-[10rem] font-GmarketSans font-bold'>
					INSAN
				</span>
			</div>
		</div>
	);
};

export default function Home() {
	const wave = useRef(null);
	const background = useRef(null);
	const circle = useRef(null);
	const isInView = useInView(wave, { margin: '0px 0px 150px 0px' });
	const isInBackround = useInView(background, { margin: '0% 0% 100% 0%' });
	const { scrollYProgress } = useScroll({ target: circle });
	const mouseX = useSpring(0);
	const mouseY = useSpring(0);
	const mouseCoord = (opX = 0, opY = 0) => {
		mouseX.set(opX);
		mouseY.set(opY);
	};
	const onMove = (e: MouseEvent) => {
		if (e.pageY < 2200) {
			const offsetX = e.clientX - window.innerWidth / 2;
			const offsetY = e.clientY - window.innerHeight / 2;
			mouseCoord(offsetX, offsetY);
		} else {
			mouseCoord();
		}
	};
	const onLeave = () => {
		mouseCoord();
	};
	return (
		<div
			ref={background}
			onMouseMove={onMove}
			onMouseLeave={onLeave}
			className='w-[100vw] h-[100vh]'
		>
			<Chevron scrollYProgress={scrollYProgress} isInView={isInView} />
			<SnsLink scrollYProgress={scrollYProgress} isInView={isInView} />
			<Layout seoTitle='INSAN' nav={{ isShort: isInBackround ? false : true }}>
				<CircleSection
					inheritRef={circle}
					mouseX={mouseX}
					mouseY={mouseY}
					scrollYProgress={scrollYProgress}
				/>
				<WavesSection inheritRef={wave} scrollYProgress={scrollYProgress} />
				<VideosSection />
				<TextSection />
				<OutroSection />
			</Layout>
		</div>
	);
}
