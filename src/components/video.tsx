import {
	MotionValue,
	useAnimate,
	useInView,
	m,
	useTransform,
	usePresence,
	useScroll,
	AnimatePresence,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubeProps } from 'react-youtube';
import Circles from './circles';
import { cls } from '@/libs/client/utils';
import Image from 'next/image';

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
	innerWidth: number;
}

interface VideoSectionProps {
	innerWidth: number;
}

interface VideoSectionIndicatorProps {
	scrollYProgress: MotionValue<number>;
	innerWidth: number;
}

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
	return (
		<article ref={ref} className='relative'>
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
						css: 'w-[calc(28px+100%)] sm:w-[calc(50px+100%)]',
					}}
				/>
			</div>
			<div className='relative bg-[#101010] w-full aspect-square rounded-full flex justify-center items-center overflow-hidden'>
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
						loading='lazy'
						onReady={onVideoReady}
						onStateChange={(e) => {
							if (video) {
								onVideoStateChange(e);
							}
						}}
						className='relative h-full aspect-video pointer-events-none'
					/>
				</div>
				<m.div
					onClick={() => {
						setThumnail((p) => !p);
					}}
					style={{ opacity: thumnail ? 1 : 0 }}
					className='absolute top-0 h-full aspect-video cursor-pointer duration-300'
				>
					<Image
						src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
						width={1600}
						height={900}
						alt={`${videoId}유튜브영상 썸네일`}
						className='absolute h-full aspect-video'
					/>
					<div className='absolute top-0 h-full aspect-video bg-[#202020] opacity-[35%]' />
				</m.div>
			</div>
		</article>
	);
};

const VideoContainer = ({
	index,
	title,
	role,
	description,
	date,
	videoId,
	innerWidth,
}: VideoContainerProps) => {
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
			<div className='relative h-[100vh] w-screen flex justify-start items-center'>
				<div className='absolute w-full h-full flex items-center'>
					<Image
						src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
						alt='1'
						width={1600}
						height={900}
						style={{ objectFit: 'cover' }}
						className='relative h-[80vh] aspect-video bg-pink-300'
					/>
					<div className='absolute top-0 w-full h-full bg-[#101010] opacity-90' />
				</div>
				<div
					ref={videoScope}
					className='w-[100vw-48px] m-auto sm:w-[600px] sm:ml-[calc(20vw)]'
				>
					<Video videoId={videoId} />
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

const VideoSectionIndicator = ({
	scrollYProgress,
	innerWidth,
}: VideoSectionIndicatorProps) => {
	const [isPresent, safeToRemove] = usePresence();
	const [indicator, animate] = useAnimate();
	const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);
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
					Artist
				</div>
			</div>
		</div>
	);
};

export default function VideosSection({ innerWidth }: VideoSectionProps) {
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
}
