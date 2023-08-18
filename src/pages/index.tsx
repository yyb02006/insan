import Chevron from '@/components/chevron';
import Circles from '@/components/circles';
import Layout from '@/components/layout';
import useMouseSpring from '@/libs/client/useMouseSpring';
import { cls } from '@/libs/client/utils';
import {
	MotionValue,
	Variants,
	useInView,
	useScroll,
	useTransform,
	m,
	useAnimate,
	usePresence,
	AnimatePresence,
	useMotionValueEvent,
	motionValue,
} from 'framer-motion';
import Link from 'next/link';
import {
	MutableRefObject,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from 'react';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import Image from 'next/image';
import VimeoPlayer from 'react-player/vimeo';
import { NextPage } from 'next';

interface MouseEventProps {
	mouseX: MotionValue;
	mouseY: MotionValue;
	scrollYProgress: MotionValue<number>;
}

interface HeaderProps extends MouseEventProps {
	inheritRef: MutableRefObject<null>;
	innerWidth: number;
}

interface SpringTextProps extends MouseEventProps {
	innerWidth: number;
}

interface SnsLinkProps {
	scrollYProgress: MotionValue<number>;
	isInView?: boolean;
}

interface springTextMotionLiProps {
	mouseX: MotionValue<any>;
	mouseY: MotionValue<any>;
	innerWidth: number;
	ratio: number;
	css: string;
	children?: ReactNode;
}

interface WaveSectionProps {
	scrollYProgress: MotionValue<number>;
	inheritRef: MutableRefObject<null>;
	innerWidth: number;
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
	innerWidth: number;
}

interface VideoProps {
	videoId: string;
	thumbnailLink: string;
}

interface VideoContainerProps {
	index: number;
	title: string;
	role: string;
	description: string;
	date: string;
	videoId: string;
	innerWidth: number;
	thumbnailLink: string;
}

interface VideoSectionProps {
	innerWidth: number;
}

interface VideoSectionIndicatorProps {
	scrollYProgress: MotionValue<number>;
	innerWidth: number;
}

interface TextSectionMotionProps {
	scrollYProgress: MotionValue<number>;
	scrollStart: number;
	scrollEnd: number;
	isStroke?: boolean;
	css?: string;
	children?: ReactNode;
}

export const wave = (sec: number, reverse: boolean = false): Variants => {
	if (reverse) {
		return {
			wave: {
				x: '-100vw',
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
				x: `0vw`,
				transition: {
					ease: 'linear',
					duration: sec,
					repeat: Infinity,
				},
			},
		};
	}
};

/**flex속성 필수 */
export const waveContainer: Variants = {
	hidden: {
		opacity: 0,
	},
	visible: (i: number = 1) => ({
		opacity: 1,
		transition: { staggerChildren: i, delayChildren: 0 },
	}),
};

export const waveChild: Variants = {
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

const SpringTextMotionLi: NextPage<springTextMotionLiProps> = ({
	mouseX,
	mouseY,
	innerWidth,
	ratio,
	css,
	children,
}) => {
	const x = useTransform(mouseX, (offset) =>
		innerWidth > 640 ? offset / 15 : null
	);
	const y = useTransform(mouseY, (offset) =>
		innerWidth > 640 ? offset / ratio : null
	);
	return (
		<m.li
			style={{
				x,
				y,
			}}
			className={css}
		>
			{children}
		</m.li>
	);
};

const SpringText = ({
	mouseX,
	mouseY,
	scrollYProgress,
	innerWidth,
}: SpringTextProps) => {
	const elements = useRef([
		{ title: 'Future', yRatio: 2.5, text: 'text-[2.5rem] md:text-[4.5rem]' },
		{
			title: 'Creative',
			yRatio: 3.5,
			text: 'text-[3.75rem] md:text-[5.75rem]',
		},
		{ title: 'Emotional', yRatio: 6, text: 'text-[5rem] md:text-[7rem]' },
		{
			title: 'Intuitive',
			yRatio: 3.5,
			text: 'text-[3.75rem] md:text-[5.75rem]',
		},
		{ title: 'Trendy', yRatio: 2.5, text: 'text-[2.5rem] md:text-[4.5rem]' },
	]);
	const y = useTransform(scrollYProgress, [0.4, 0.5, 0.8], [0, 600, 1000]);
	/* useEffect(() => {
		window.addEventListener('scroll', () =>
			console.log({ scrollYProgress: scrollYProgress.get(), scrollY })
		);
		window.removeEventListener('scroll', () =>
			console.log({ scrollYProgress: scrollYProgress.get(), scrollY })
		);
	}, []); */
	return (
		<>
			<div className='flex border border-[#bababa] justify-center items-center overflow-hidden w-full aspect-square rounded-full'>
				<m.ul
					style={{ y }}
					className='font-Roboto text-[#efefef] font-extrabold leading-snug text-center '
				>
					{elements.current.map((element, idx) => (
						<SpringTextMotionLi
							key={idx}
							innerWidth={innerWidth}
							mouseX={mouseX}
							mouseY={mouseY}
							ratio={element.yRatio}
							css={element.text}
						>
							{element.title}
						</SpringTextMotionLi>
					))}
				</m.ul>
			</div>
		</>
	);
};

const SnsLink: NextPage<SnsLinkProps> = ({ scrollYProgress, isInView }) => {
	const scale = useTransform(scrollYProgress, [0.25, 0.45], [1, 0]);
	const visibility = useTransform(scrollYProgress, (value) => {
		if (value > 0.3) {
			return 'hidden';
		} else {
			return 'visible';
		}
	});
	return (
		<m.div
			style={{ visibility }}
			className='fixed right-0 w-full h-full flex justify-end items-end text-[#efefef] z-[1]'
		>
			<m.div
				style={{ scale }}
				initial='hidden'
				animate='visible'
				variants={sideCircle}
				className='absolute w-[200px] lg:w-[260px] aspect-square rounded-full border border-[#bababa] -bottom-12 -right-10 origin-bottom-right'
			/>
			<m.ul
				animate={!isInView ? 'visible' : 'disappear'}
				variants={snsAnchor}
				className='pr-[40px] md:pr-[60px] pb-8 flex flex-col items-end font-Roboto font-light text-sm lg:text-lg gap-2 z-[1]'
			>
				{[
					{ name: 'Instagram', href: 'https://www.instagram.com/yarg__gray' },
					{ name: 'Vimeo', href: '' },
					{ name: 'YouTube', href: 'https://www.youtube.com/@insan8871' },
				].map((arr, idx) => (
					<m.li key={idx} variants={snsList} className='hover:text-palettered'>
						<Link href={arr.href} target='_blank'>
							{arr.name}
						</Link>
					</m.li>
				))}
			</m.ul>
		</m.div>
	);
};

const CircleSection: NextPage<HeaderProps> = ({
	mouseX,
	mouseY,
	innerWidth,
	scrollYProgress,
	inheritRef,
}) => {
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
		'top-[-220px] left-[-200px] w-[360px] lg:w-[460px]',
		'top-[-120px] left-[-80px] w-[240px] lg:w-[340px]',
	]);
	return (
		<section className='relative h-[500vh] mb-[100vh]' ref={inheritRef}>
			<div className='absolute top-0 h-[80%]'>
				<m.div style={{ scale: logoCircle }} className='sticky top-0'>
					{logoCircles.current.map((arr, idx) => (
						<m.div
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
				</m.div>
			</div>
			<div className='h-full flex justify-center items-start'>
				<m.div
					style={{ scale, y }}
					className='sticky top-0 h-[100vh] w-full flex items-center justify-center'
				>
					<div className='overflow-hidden absolute w-[100vw] aspect-square flex justify-center items-center'>
						<div className='absolute md:w-[540px] w-[70%] aspect-square'>
							<Circles
								ulMotion={{
									style: { rotate },
									initial: 'initial',
									animate: 'bigger',
									variants: list,
								}}
								liMotion={{
									style: { scale: circleLineScale },
									css: 'md:w-[calc(50px+100%)] w-[calc(112%)]',
								}}
							/>
						</div>
					</div>
					<m.div
						animate={{
							scale: [0, 1],
							borderRadius: ['0%', '100%'],
						}}
						transition={{
							duration: 0.7,
						}}
						className='relative bg-[#101010] md:w-[540px] w-[70%] scale-0 aspect-square rounded-full flex justify-center items-center'
					>
						<SpringText
							mouseX={mouseX}
							mouseY={mouseY}
							innerWidth={innerWidth}
							scrollYProgress={scrollYProgress}
						/>
					</m.div>
				</m.div>
			</div>
		</section>
	);
};

const Wave: NextPage<WaveProps> = ({
	scrollYProgress,
	letter,
	startHeight,
	endHeigth,
	inViewCondition,
	waveSec,
	waveReverse = false,
	css = '',
	letterHeightFix = -65,
	index,
	innerWidth,
}) => {
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
			<div className='absolute w-full flex justify-center h-auto'>
				<m.div
					style={{ y, visibility }}
					initial='hidden'
					animate={isInView ? 'visible' : 'hidden'}
					variants={innerWidth > 640 ? waveContainer : {}}
					custom={0.08}
					className={cls(
						css,
						'relative w-full max-w-[1920px] top-9 sm:top-7 md:top-5 lg:top-3 xl:top-0 flex px-[10vw] font-Roboto font-black text-[calc(14px+5.5vw)] text-[#fafafa]'
					)}
				>
					{waveReverse
						? [...letter].reverse().map((test, idx) => (
								<m.span variants={innerWidth > 640 ? waveChild : {}} key={idx}>
									{test === ' ' ? '\u00A0' : test}
								</m.span>
						  ))
						: letter.map((test, idx) => (
								<m.span variants={innerWidth > 640 ? waveChild : {}} key={idx}>
									{test === ' ' ? '\u00A0' : test}
								</m.span>
						  ))}
				</m.div>
			</div>
			<div className='absolute mt-8 md:mt-20 bg-[#101010] w-full h-[200px]' />
			<div className='w-[100vw] overflow-hidden'>
				<m.div
					initial={{ x: waveReverse ? 0 : '-100vw' }}
					variants={wave(waveSec, waveReverse)}
					className={cls(
						waveReverse ? 'bg-wave-pattern-reverse' : 'bg-wave-pattern',
						'relative w-[200vw] max-h-[400px] aspect-[1920/400] bg-[length:100vw] bg-repeat-x'
					)}
				></m.div>
			</div>
		</div>
	);
};

const WavesSection: NextPage<WaveSectionProps> = ({
	scrollYProgress,
	inheritRef,
	innerWidth,
}) => {
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
		<m.div
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
						innerWidth={innerWidth}
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
						innerWidth={innerWidth}
					></Wave>
				)
			)}
		</m.div>
	);
};

const Video: NextPage<VideoProps> = ({ videoId, thumbnailLink }) => {
	const ref = useRef(null);
	// const isInView = useInView(ref,{once:true,amount:0.8});
	const [thumnail, setThumnail] = useState(true);
	const [isLoadable, setIsLoadable] = useState(false);
	const [play, setPlay] = useState(false);
	const [start, setStart] = useState(false);
	/* const onVideoReady: YouTubeProps['onReady'] = (e) => {
		setVideo(e);
		setVideoLoad(true);
	};
	const onVideoStateChange: YouTubeProps['onStateChange'] = (e) => {
		setVideoState(e.data);
		console.log(e.data);
	};
	useEffect(() => {
		if (
			!thumnail &&
			video &&
			videoLoad &&
			(videoState < 1 || videoState === 2)
		) {
			video.target.playVideo();
		} else if (thumnail && video && videoState === 1) {
			video.target.pauseVideo();
		} else if (video && videoState === 0) {
			video.target.stopVideo();
		}
		if (video && videoState === 1) {
		}
	}, [thumnail, video, videoState]); */
	/* useEffect(() => {
		if (isInView && !isLoad) {
			setIsLoad(true);
		}
	}, [isInView]); */
	return (
		<article
			ref={ref}
			className='relative sm:left-6 lg:left-4 xl:left-0 w-[70vw] sm:w-[calc(20vw+256px)] xl:w-auto'
		>
			<div className='Wrapper absolute top-0 w-full aspect-square flex justify-center items-center'>
				<div className='absolute w-[104%] aspect-square'>
					<Circles
						ulMotion={{
							css: cls(
								play ? 'animate-spin-slow' : 'animate-spin-slow pause',
								'transition-all'
							),
						}}
						liMotion={{
							css: 'w-[calc(28px+100%)] sm:w-[calc(30px+100%)] lg:w-[calc(40px+100%)] xl:w-[calc(50px+100%)]',
						}}
					/>
				</div>
			</div>
			<div className='relative bg-[#101010] w-full aspect-square rounded-full flex justify-center items-center overflow-hidden'>
				<div className='relative h-full aspect-video'>
					{isLoadable ? (
						<>
							<VimeoPlayer
								url={`https://player.vimeo.com/video/${videoId}`}
								controls={false}
								muted={false}
								playing={play}
								width={'100%'}
								height={'100%'}
								onStart={() => {
									setStart(true);
								}}
							/>
							{!start ? (
								<div className='absolute top-0 w-full h-full flex justify-center items-center'>
									<div className='animate-spin-middle contrast-50 absolute w-[80px] aspect-square'>
										<Circles
											liMotion={{
												css: 'w-[calc(20px+100%)] border-[#eaeaea] border-1',
											}}
										/>
									</div>
								</div>
							) : null}
						</>
					) : null}
				</div>
				<m.div
					onClick={() => {
						setThumnail((p) => !p);
						isLoadable || setIsLoadable(true);
						setPlay((p) => !p);
						if (isLoadable && !start) {
							setIsLoadable(false);
						}
					}}
					style={{ opacity: thumnail ? 1 : 0 }}
					className='absolute top-0 w-auto h-full aspect-video cursor-pointer duration-300'
				>
					<div className='relative w-full h-0 aspect-video'>
						<Image
							src={thumbnailLink}
							width={1280}
							height={720}
							alt={`${videoId}유튜브영상 썸네일`}
							className='absolute top-0 left-0'
							priority
						/>
					</div>
					<div className='absolute top-0 h-full aspect-video bg-[#202020] opacity-[35%]' />
				</m.div>
			</div>
		</article>
	);
};

const VideoContainer: NextPage<VideoContainerProps> = ({
	index,
	title,
	role,
	description,
	date,
	videoId,
	innerWidth,
	thumbnailLink,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { amount: 0.5 });
	const [textScope, textAnimate] = useAnimate();
	const [videoScope, videoAnimate] = useAnimate();

	useEffect(() => {
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
									motionInfo.move === 'up'
										? motionInfo.range
										: -motionInfo.range,
							  ]
							: [
									motionInfo.move === 'up'
										? motionInfo.range
										: -motionInfo.range,
									0,
							  ],
					},
					{ duration: 0.6, ease: 'easeOut' }
				);
			});
		};
		if (isInView) {
			videoAnimate(
				'.Wrapper',
				{ scale: [0.8, 1] },
				{ duration: 0.4, ease: 'easeOut' }
			);
			if (innerWidth > 640) {
				textMotion();
			}
		} else {
			videoAnimate(
				'.Wrapper',
				{ scale: [1, 0.8] },
				{ duration: 0.4, ease: 'easeIn' }
			);
			if (innerWidth > 640) {
				textMotion(true);
			}
		}
	}, [isInView, innerWidth, textAnimate, videoAnimate]);
	return (
		<section ref={ref} className='h-[100vh] w-screen'>
			<div className='relative h-[100vh] flex justify-start items-center'>
				<div className='absolute w-full h-full px-8 sm:px-0 flex items-center'>
					<Image
						src={thumbnailLink}
						alt='1'
						width={1600}
						height={900}
						style={{ objectFit: 'cover' }}
						className='relative h-[80vh] aspect-video'
					/>
					<div className='absolute top-0 w-full h-full bg-[#101010] opacity-90' />
				</div>
				<div
					ref={videoScope}
					className='w-[100vw-48px] m-auto sm:w-[600px] sm:ml-[calc(20vw)]'
				>
					<Video videoId={videoId} thumbnailLink={thumbnailLink} />
				</div>
				<div
					ref={textScope}
					className='font-Roboto font-thin absolute py-[100px] sm:pt-[80px] sm:pb-[140px] flex flex-col justify-between items-end  text-[#eaeaea] top-0 left-0 w-[80vw] h-full aspect-square pointer-events-none'
				>
					<div className='flex justify-end items-center'>
						<div
							style={{ WebkitTextStroke: '1px #9c9c9c' }}
							className={cls(
								index === 1 ? '-mr-[3.9375vw]' : '',
								'Index font-extrabold text-[calc(23.5vw)] leading-[0.73] text-[#1E1E1E]'
							)}
						>
							{index}
						</div>
						<div className='Title font-GmarketSans font-bold absolute text-[6.5vw]'>
							{title}
						</div>
					</div>
					<div className='absolute bottom-[140px] sm:relative text-[#9a9a9a] text-3xl sm:text-5xl -mt-20 flex flex-col items-end'>
						<div className='Role'>{role}</div>
						<div className='Desc font-GmarketSans font-medium text-sm sm:text-base text-[#f4f4f4] -mt-3'>
							{description}
						</div>
					</div>
					<div className='Date text-sm sm:text-2xl'>{date}</div>
				</div>
			</div>
		</section>
	);
};

const VideosSection: NextPage<VideoSectionProps> = ({ innerWidth }) => {
	const dummyDatas = [
		{
			index: 1,
			title: 'EMOTIONAL',
			role: 'Director',
			description: '확장과 재창조, 창작의 결과물',
			date: '2023.2.22',
			videoId: '852566352',
			thumbnailLink:
				'https://i.vimeocdn.com/video/1707755112-18437e1930810b2d8db1a3018ebed3871d824a547ada768ed8f67d7855ef1cf3-d_1280x720?r=pad',
		},
		{
			index: 2,
			title: 'TRENDY',
			role: 'Camera',
			description: '엔터테인먼트와 현실의 연결',
			date: '2023.2.23',
			videoId: '844725783',
			thumbnailLink:
				'https://i.vimeocdn.com/video/1696967917-3e7e0ff4aa681be7e2acf1a61c6155ccb7420d768a8e615cc8e7d64c80606920-d_1280x720?r=pad',
		},
		{
			index: 3,
			title: 'CREATIVE',
			role: 'Art Director',
			description: '확장과 재창조, 창작의 결과물',
			date: '2023.2.24',
			videoId: '844717748',
			thumbnailLink:
				'https://i.vimeocdn.com/video/1696959898-14f7b78bd35137dcd561717429b265947ce7272a735e7b7ed8b4bc56ec229666-d_1280x720?r=pad',
		},
		{
			index: 4,
			title: 'INTUITIVE',
			role: 'Lead Developer',
			description: '영감을 주고 받은 기록',
			date: '2023.2.25',
			videoId: '852566292',
			thumbnailLink:
				'https://i.vimeocdn.com/video/1707754967-f097f998c5b730464d3e56cfd8c0c7c9fdc9376ca910ed687f63faa3d7c27db2-d_1280x720?r=pad',
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
	const inner = useRef(null);
	const isInView = useInView(inner, { margin: '0% 0% -100% 0%' });
	return (
		<section ref={vertical} className='relative h-[400vh] sm:h-[600vh]'>
			<div
				ref={inner}
				className='top-0 absolute h-[calc(100%-100vh)] w-full'
			></div>
			<div className='sticky top-0 overflow-hidden'>
				<m.div
					ref={horizental}
					style={{ x }}
					className='text-[200px] h-[100vh] w-[400vw] flex'
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
							thumbnailLink={data.thumbnailLink}
							innerWidth={innerWidth}
						/>
					))}
				</m.div>
			</div>
			<AnimatePresence>
				{isInView ? (
					<VideoSectionIndicator
						scrollYProgress={scrollYProgress}
						innerWidth={innerWidth}
					/>
				) : null}
			</AnimatePresence>
		</section>
	);
};

const VideoSectionIndicator: NextPage<VideoSectionIndicatorProps> = ({
	scrollYProgress,
	innerWidth,
}) => {
	const [isPresent, safeToRemove] = usePresence();
	const [indicator, animate] = useAnimate();
	const [role, setRole] = useState('');
	const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
	useMotionValueEvent(scrollYProgress, 'change', (prev) => {
		if (prev >= 0 && prev < 0.3) {
			setRole('Director');
		} else if (prev >= 0.3 && prev < 0.5) {
			setRole('Camera');
		} else if (prev >= 0.5 && prev < 0.8) {
			setRole('Art');
		} else if (prev >= 0.8 && prev <= 1) {
			setRole('Drone');
		}
	});
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await animate(
					indicator.current,
					{ x: innerWidth > 640 ? 60 : 40, opacity: 1 },
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
	}, [isPresent, indicator, innerWidth, animate, safeToRemove]);
	return (
		<div
			ref={indicator}
			className='fixed left-0 top-0 h-full w-[28px] hidden sm:flex items-center'
		>
			<div className='relative bg-[#202020] py-4 box-content rounded-full h-[60vh] w-full flex flex-col justify-between items-center'>
				<div className='border border-[#707070] w-[4px] h-[30vh] rounded-full absolute top-0 mt-4' />
				<div className='h-[30vh]'>
					<m.div
						style={{ scaleY }}
						className='relative h-full w-[4px] origin-top bg-[#FE4A5D] rounded-full'
					/>
				</div>
				<div
					className='tracking-[1rem] text-lg text-[#eaeaea]'
					style={{ writingMode: 'vertical-rl' }}
				>
					{role}
				</div>
			</div>
		</div>
	);
};

const TextSectionMotionSpan: NextPage<TextSectionMotionProps> = ({
	scrollYProgress,
	scrollStart,
	scrollEnd,
	css,
	children,
	isStroke = false,
}) => {
	const y = useTransform(scrollYProgress, [scrollStart, scrollEnd], [100, 0]);
	const opacity = useTransform(
		scrollYProgress,
		[scrollStart, scrollEnd],
		[0, 1]
	);
	return (
		<m.span
			style={{
				y,
				opacity,
				WebkitTextStroke: isStroke ? '1px #9c9c9c' : undefined,
			}}
			className={css}
		>
			{children}
		</m.span>
	);
};

const TextSection: NextPage = () => {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});
	const scale = useTransform(scrollYProgress, [0, 0.4], [0.5, 1]);
	const rotate = useTransform(scrollYProgress, [0, 0.4], [90, 0]);
	return (
		<section
			ref={ref}
			//문제 있음 각 사이즈 별로
			className='relative mt-[50vh] h-[auto] sm:h-[auto] pb-[10vw] flex justify-center overflow-hidden'
		>
			<m.div
				style={{ scale, rotate }}
				className='absolute -right-[45vw] sm:-right-[calc(30vw)] top-20 h-[70vw] sm:h-[calc(54vw-80px)] xl:h-[calc(50vw-50px)] aspect-square'
			>
				<Circles
					liMotion={{
						css: 'w-[calc(25px+100%)] sm:w-[calc(35px+100%)] lg:w-[calc(50px+100%)]',
					}}
				/>
			</m.div>
			<div className='relative font-GmarketSans font-bold leading-[1.2] sm:leading-[1.4] lg:leading-[1.3] xl:leading-[1.2] text-[#101010] text-[calc(16px+9vw)] pr-0 sm:pl-10 md:pr-20 '>
				<TextSectionMotionSpan
					scrollYProgress={scrollYProgress}
					scrollStart={0.1}
					scrollEnd={0.2}
					css='block'
					isStroke={true}
				>
					Moves
				</TextSectionMotionSpan>
				<div className='flex flex-col text-[calc(16px+4vw)] text-[#dadada] -mt-0 space-y-2 sm:space-y-0 sm:-mt-6 mb-2 sm:-mb-2 -ml-6 sm:-ml-16'>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.15}
						scrollEnd={0.25}
					>
						좋은 영상을{' '}
						<div className='font-extralight sm:inline'>만든다는 것은,</div>
					</TextSectionMotionSpan>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.2}
						scrollEnd={0.3}
					>
						당신께 감동을{' '}
						<div className='font-extralight sm:inline'>드린다는 것.</div>
					</TextSectionMotionSpan>
				</div>
				<TextSectionMotionSpan
					scrollYProgress={scrollYProgress}
					scrollStart={0.25}
					scrollEnd={0.35}
					css='block'
					isStroke={true}
				>
					Client
				</TextSectionMotionSpan>
				<div className='relative flex flex-col text-[calc(16px+4vw)] text-[#dadada] -mt-0 space-y-2 sm:space-y-0 sm:-mt-6 mb-2 sm:-mb-2 -ml-6 sm:-ml-16'>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.3}
						scrollEnd={0.4}
						css='block absolute text-[calc(16px+9vw)] text-[#101010] -left-8 sm:-left-16 flex items-center h-full sm:h-auto'
						isStroke={true}
					>
						&
					</TextSectionMotionSpan>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.3}
						scrollEnd={0.4}
						css='relative'
					>
						상상이 현실이{' '}
						<div className='font-extralight sm:inline'>되는 감동을,</div>
					</TextSectionMotionSpan>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.37}
						scrollEnd={0.47}
						css='relative'
					>
						더 나은 컨텐츠로의{' '}
						<div className='font-extralight sm:inline'>영감을.</div>
					</TextSectionMotionSpan>
				</div>
				<TextSectionMotionSpan
					scrollYProgress={scrollYProgress}
					scrollStart={0.42}
					scrollEnd={0.52}
					css='block'
					isStroke={true}
				>
					Customer
				</TextSectionMotionSpan>
			</div>
		</section>
	);
};

const OutroSection: NextPage = () => {
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
					className='relative w-[55vw] sm:h-[55vw] lg:h-[35vw] xl:h-[30vw] max-h-[800px] aspect-square flex justify-center items-center rounded-full'
				>
					<div className='Container absolute w-full sm:w-auto sm:h-full aspect-square'>
						<Circles
							ulMotion={{
								css: cls(
									isInView ? 'animate-spin-slow' : 'animate-spin-slow pause',
									'transition-transform'
								),
							}}
							liMotion={{
								css: 'w-[calc(30px+100%)] sm:w-[calc(40px+100%)] lg:w-[calc(50px+100%)]',
							}}
						/>
					</div>
					<span
						style={{ WebkitTextStroke: '1px #eaeaea' }}
						className='Text relative text-[#101010] text-[6rem] sm:text-[7.375rem] lg:text-[8.625rem] xl:text-[10rem] font-GmarketSans font-bold'
					>
						INSAN
					</span>
				</div>
			</Link>
		</div>
	);
};

const Home: NextPage = () => {
	useEffect(() => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		setIsMobile(
			/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
				userAgent
			)
		);
	}, []);
	const wave = useRef(null);
	const background = useRef(null);
	const circle = useRef(null);
	const [innerWidth, setInnerWidth] = useState(0);
	const isInView = useInView(wave, { margin: '0px 0px 150px 0px' });
	const isInBackground = useInView(background, { margin: '0% 0% 100% 0%' });
	const [isMobile, setIsMobile] = useState(true);
	const { scrollYProgress } = useScroll({ target: circle });
	const { onMove, onLeave, mouseX, mouseY } = useMouseSpring({
		limitHeight: 2200,
		isMobile: isMobile,
	});
	const handleResize = () => {
		setInnerWidth(window.innerWidth);
	};
	useEffect(() => {
		setInnerWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	/* 반응형 대응 할 때 vh값에 따른 넓이값 변화량이 꽤 유동적이라는 것을 염두에 두자*/
	return (
		<div
			ref={background}
			onMouseMove={!isMobile ? onMove : undefined}
			onMouseLeave={!isMobile ? onLeave : undefined}
			className='w-[100vw] h-[100vh]'
		>
			<Chevron scrollYProgress={scrollYProgress} isInView={isInView} />
			<SnsLink scrollYProgress={scrollYProgress} isInView={isInView} />
			<Layout
				seoTitle='INSAN'
				nav={{
					isShort: innerWidth > 640 ? !isInBackground : true,
				}}
				isMobile={isMobile}
			>
				<CircleSection
					inheritRef={circle}
					innerWidth={innerWidth}
					mouseX={mouseX}
					mouseY={mouseY}
					scrollYProgress={scrollYProgress}
				/>
				<WavesSection
					inheritRef={wave}
					scrollYProgress={scrollYProgress}
					innerWidth={innerWidth}
				/>
				<VideosSection innerWidth={innerWidth} />
				<TextSection />
				<OutroSection />
			</Layout>
		</div>
	);
};

export default Home;
