import Circles from '@/components/circles';
import Layout from '@/components/layout';
import { cls, fetchYouTubeApi } from '@/libs/client/utils';
import {
	motion,
	AnimatePresence,
	useAnimate,
	usePresence,
	useInView,
	animate,
	useMotionValue,
	useTransform,
	Variants,
} from 'framer-motion';
import Link from 'next/link';
import {
	Dispatch,
	MutableRefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import { waveChild, waveContainer } from '..';
import Input from '@/components/input';
import Image from 'next/image';
import { Works } from '@prisma/client';
import ToTop from '@/components/toTop';
import VimeoPlayer from 'react-player/vimeo';
import ReactPlayer from 'react-player/lazy';
import YouTubePlayer from 'react-player/youtube';
import { FixedSizeList } from 'react-window';
import { useInfiniteScroll } from '@/libs/client/useInfiniteScroll';
import { VideoResponseItem } from '../api/work/list';

export type VideosCategory = 'film' | 'short' | 'outsource';

interface TagButtonProps {
	tag: { name: string };
	css: string;
	onTagFunction: (tag: string) => void;
}

interface TitleSvgPresenseProps {
	explanation: string;
}

interface TitleSectionProps {
	setCategory: Dispatch<SetStateAction<VideosCategory>>;
}

interface TagButtonSectionProps {
	setSelectedTags: Dispatch<SetStateAction<string[]>>;
}

interface SearchSectionProp {
	setKeyWords: Dispatch<SetStateAction<keyWordsState>>;
}

interface VideoSectionProps {
	category: VideosCategory;
	keywords: keyWordsState;
	setOnDetail: Dispatch<SetStateAction<OnDetail | undefined>>;
}

interface VideoProps {
	index: string;
	waiting: number;
	thumbnail: { url: string; width: number; height: number; alt: string };
	title: string;
	description: string;
	category: VideosCategory;
	resource: string;
	date: string;
	setOnDetail: Dispatch<SetStateAction<OnDetail | undefined>>;
	setAnimationEnd?: Dispatch<SetStateAction<boolean>>;
}

interface OnDetail {
	isOpen: boolean;
	title: string;
	description: string;
	date: string;
	resource: string;
	category: VideosCategory;
	imageUrl: string;
}

interface keyWordsState {
	searchWord: string;
	selectedTags: string[];
}

const titleContainer: Variants = {
	initial: {},
	animate: {
		transition: { staggerChildren: 0.1, delayChildren: 1 },
	},
};

const titleChild: Variants = {
	initial: { WebkitTextStroke: '1px #9c9c9c' },
	animate: {
		WebkitTextStroke: '0px',
		color: '#eaeaea',
		transition: { type: 'spring' },
	},
};

const categoryContainer: Variants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.2, delayChildren: 1 },
	},
};

const categoryChild: Variants = {
	hidden: { pointerEvents: 'none', y: -40, opacity: 0 },
	visible: {
		pointerEvents: 'all',
		y: 0,
		opacity: 1,
		//스타일에 duration이 이미 있으면 초기화 필수
		transition: { duration: 0 },
	},
};

const TitleSvgPresense = ({ explanation }: TitleSvgPresenseProps) => {
	const [chevron, chevronAnimate] = useAnimate();
	const [isPresent, safeToRemove] = usePresence();
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await chevronAnimate(
					chevron.current,
					{ x: [40, 0], opacity: 1 },
					{ duration: 0.3 }
				);
				await chevronAnimate('div', { opacity: [0, 1] }, { duration: 0.1 });
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				await chevronAnimate(
					chevron.current,
					{ x: [0, 40], opacity: 0 },
					{ duration: 0.3 }
				);
				await chevronAnimate('div', { opacity: [1, 0] }, { duration: 0.1 });
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent, chevron, chevronAnimate]);
	return (
		<div ref={chevron} className='relative opacity-0 flex items-center'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				stroke='currentColor'
				className='w-6 h-6 inline-block'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M15.75 19.5L8.25 12l7.5-7.5'
				/>
			</svg>
			<div className='Desc text-lg opacity-0 ml-2 mt-1'>{explanation}</div>
		</div>
	);
};

type categories = {
	title: string;
	kind: VideosCategory;
	count: number;
	idx: number;
	explanation: string;
};

const TitleSection = ({ setCategory }: TitleSectionProps) => {
	const [categoryState, setCategoryState] = useState<VideosCategory>('film');
	const dataLength = useRef(389);
	const rotate = useRef(0);
	const categories: categories[] = [
		{
			title: 'Film & AD',
			kind: 'film',
			count: 225,
			idx: 1,
			explanation: '16 : 9',
		},
		{
			title: 'Short-form',
			kind: 'short',
			count: 22,
			idx: 2,
			explanation: '9 : 16',
		},
		{
			title: 'Outsource',
			kind: 'outsource',
			count: 13,
			idx: 3,
			explanation: 'partial',
		},
	];
	const count = useMotionValue(0);
	const ref = useRef<HTMLDivElement>(null);
	const rounded = useTransform(count, Math.round);
	useEffect(() => {
		const animation = animate(count, dataLength.current, {
			duration: 1,
			ease: [0.8, 0, 0.2, 1],
			onUpdate(value) {
				if (ref.current) {
					ref.current.textContent = value.toFixed(0);
				}
			},
		});
		return animation.stop;
	}, [rounded, count]);
	useEffect(() => {
		setCategory(categoryState);
		switch (categoryState) {
			case 'film':
				rotate.current = 0;
				break;
			case 'short':
				rotate.current = 120;
				break;
			case 'outsource':
				rotate.current = 240;
				break;
			default:
				rotate.current = 0;
				break;
		}
	}, [categoryState, setCategory]);
	return (
		<section className='relative px-9'>
			<motion.div
				style={{ rotate: rotate.current }}
				className={
					'absolute min-w-[1000px] w-[calc(1000px+50%)] h-full top-0 left-[-800px] sm:left-[-700px] lg:left-[-800px] flex items-center transition-transform duration-1000'
				}
			>
				<Circles liMotion={{ css: 'w-[calc(50px+100%)]' }} />
			</motion.div>
			<div className='relative inline-block'>
				<motion.div className='relative flex flex-wrap text-[calc(60px+4.5vw)] sm:text-[calc(20px+6.5vw)] font-bold leading-none'>
					<span className='font-light'>
						<span ref={ref} className='absolute'></span>
						<span className='invisible'>{dataLength.current}&nbsp;</span>
					</span>
					<motion.span
						initial={'initial'}
						animate={'animate'}
						variants={titleContainer}
						className='flex'
					>
						{Array.from('Works').map((spell, idx) => (
							<motion.span
								key={idx}
								variants={titleChild}
								className='text-[#101010]'
							>
								{spell}
							</motion.span>
						))}
					</motion.span>
				</motion.div>
				<motion.div
					initial={'hidden'}
					animate={'visible'}
					variants={categoryContainer}
				>
					{categories.map((category) => (
						<motion.div
							key={category.idx}
							variants={categoryChild}
							onClick={() => {
								setCategoryState(category.kind);
							}}
							className={cls(
								categoryState === category.kind
									? 'text-palettered'
									: 'text-[#bababa]',
								'relative flex justify-between items-center font-light cursor-pointer transition-color duration-300'
							)}
						>
							{/* {categoryState === category.kind ? (
								<div className='absolute bg-[#151515] w-full h-[40%]' />
							) : null} */}
							<div className='relative text-[1.5rem] sm:text-[calc(20px+0.7vw)] leading-tight'>
								<div className='inline-block pr-3'>{category.count} </div>
								{category.title}
							</div>
							<AnimatePresence>
								{categoryState === category.kind ? (
									<TitleSvgPresense explanation={category.explanation} />
								) : null}
							</AnimatePresence>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};

const TagButton = ({ tag, css, onTagFunction }: TagButtonProps) => {
	const [isPresent, safeToRemove] = usePresence();
	const [button, buttonAnimate] = useAnimate();
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await buttonAnimate(
					button.current,
					{ y: [-20, 0], opacity: [0, 1] },
					{ duration: 0.2, delay: 0.1 }
				);
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				await buttonAnimate(
					button.current,
					{ y: [0, -20], opacity: [1, 0] },
					{ duration: 0.1 }
				);
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent, button, buttonAnimate, safeToRemove]);
	return (
		<div ref={button}>
			<button
				onClick={() => {
					onTagFunction(tag.name);
				}}
				className={cls(css, 'border rounded-full p-2')}
			>
				{tag.name}
			</button>
		</div>
	);
};

const TagButtonSection = ({ setSelectedTags }: TagButtonSectionProps) => {
	const [tags, setTags] = useState({
		selected: ['All'],
		tagList: [
			{ name: 'All', isSelected: true },
			{ name: 'Camera', isSelected: false },
			{ name: 'Director', isSelected: false },
			{ name: 'Edit', isSelected: false },
		],
	});
	const onTagInsert = (tag: string) => {
		setTags(
			(p) =>
				(p = {
					selected: [...p.selected, tag],
					tagList: p.tagList.map((arr) => ({
						name: arr.name,
						isSelected: arr.name === tag ? true : arr.isSelected,
					})),
				})
		);
	};
	const onTagDelete = (tag: string) => {
		setTags(
			(p) =>
				(p = {
					selected: p.selected.filter((arr) => arr !== tag),
					tagList: p.tagList.map((arr) => ({
						name: arr.name,
						isSelected: arr.name === tag ? false : arr.isSelected,
					})),
				})
		);
	};
	useEffect(() => {
		setSelectedTags(tags.selected);
	}, [tags]);
	return (
		<section className='relative bg-[#101010] py-6 flex justify-between px-9'>
			<div className='flex font-medium text-palettered leading-none text-sm gap-2'>
				<AnimatePresence>
					{tags.selected.map((tag) => (
						<TagButton
							key={tag}
							tag={{ name: tag }}
							css='border-palettered'
							onTagFunction={onTagDelete}
						></TagButton>
					))}
				</AnimatePresence>
			</div>
			<div className='flex font-medium text-[#bababa] leading-none text-sm gap-2'>
				<AnimatePresence>
					{tags.tagList.map((tag) =>
						!tag.isSelected ? (
							<TagButton
								key={tag.name}
								tag={tag}
								css='border-[#9a9a9a] hover:border-palettered hover:text-palettered transition-colors duration-200'
								onTagFunction={onTagInsert}
							/>
						) : null
					)}
				</AnimatePresence>
			</div>
		</section>
	);
};

const SearchSection = ({ setKeyWords }: SearchSectionProp) => {
	const [selectedTags, setSelectedTags] = useState(['']);
	const [searchWord, setSearchWord] = useState('');
	const onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
		setSearchWord(e.currentTarget.value);
	};
	const onsubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setKeyWords((p) => ({ ...p, searchWord }));
	};
	useEffect(() => {
		setKeyWords((p) => ({ ...p, selectedTags }));
	}, [selectedTags]);
	return (
		<section>
			<form
				onSubmit={onsubmit}
				className='relative mt-[10vh] mx-9 font-light flex items-center gap-2 pb-1 border-b border-[#9a9a9a] text-lg leading-tight text-[#eaeaea]'
			>
				<button>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={2}
						stroke='currentColor'
						className='w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
						/>
					</svg>
				</button>
				<Input
					name='search'
					type='text'
					placeholder='search'
					css='border-none placeholder:font-bold bg-transparent'
					onChange={onChange}
				/>
			</form>
			<TagButtonSection setSelectedTags={setSelectedTags} />
		</section>
	);
};

interface VideoTitlePresenseProps {
	title: string;
	description: string;
}

const VideoTitlePresense = ({
	title,
	description,
}: VideoTitlePresenseProps) => {
	const [intro, animate] = useAnimate();
	const [isPresent, safeToRemove] = usePresence();
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				animate('div', { x: 0 }, { duration: 0 });
				animate(
					'.Desc',
					{ y: [40, 0], opacity: [0, 1] },
					{ duration: 0.4, ease: 'easeOut' }
				);
				await animate(
					'.Title',
					{ y: [-40, 0], opacity: [0, 1] },
					{ duration: 0.4, ease: 'easeOut' }
				);
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				animate(
					'.Desc',
					{ x: [0, 40], opacity: [1, 0] },
					{ duration: 0.4, ease: 'easeIn' }
				);
				await animate(
					'.Title',
					{ x: [0, -40], opacity: [1, 0] },
					{ duration: 0.4, ease: 'easeIn' }
				);
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent, animate, safeToRemove]);
	return (
		<div
			ref={intro}
			className='absolute w-full h-[40%] flex flex-col justify-center items-center font-bold pointer-events-none'
		>
			<div className='absolute top-0 left-0 w-full h-full bg-[#101010] opacity-30'></div>
			<div className='relative Title'>{title}</div>
			<div className='relative Desc font-medium text-xl'>{description}</div>
		</div>
	);
};

interface VideoDetailProps {
	title: string;
	date: string;
	resource: string;
	category: VideosCategory;
	thumbnail: string;
	setOnDetail: Dispatch<SetStateAction<OnDetail | undefined>>;
}

interface youtubeDesc {
	items: { snippet: description }[];
}

interface description {
	description: string;
}

const VideoDetail = ({
	title,
	date,
	resource,
	category,
	thumbnail,
	setOnDetail,
}: VideoDetailProps) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [description, setDescription] = useState<string>();
	const pattern = /\/([^/]+)\?/;
	useEffect(() => {
		if (category === 'film' || category === 'short') {
			fetch(
				`https://api.vimeo.com/videos/${
					resource.match(pattern)?.[1]
				}?fields=description`,
				{
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
						Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
					},
				}
			)
				.then((res) => res.json())
				.then((data) => {
					setDescription(data.description);
					console.log(data);
				});
		} else if (category === 'outsource') {
			fetchYouTubeApi(
				'videos',
				'10',
				(data: youtubeDesc) => {
					setDescription(data.items[0].snippet.description);
				},
				'items(snippet(description))',
				undefined,
				resource
			);
		}
	}, []);
	return (
		<>
			<div className='fixed w-screen h-screen top-0 left-0 bg-black opacity-80' />
			<div className='fixed overflow-y-scroll scrollbar-hide top-0 left-0 w-screen h-full p-4 bg-transparent'>
				<div className='w-full h-auto py-16 bg-[#101010]'>
					<div className='w-full flex xl:flex-nowrap flex-wrap justify-evenly gap-y-12'>
						<div className='relative w-full xl:max-w-[1400px] lg:max-w-[1100px] max-w-[1280px]'>
							{category === 'film' || category === 'short' ? (
								<>
									<VimeoPlayer
										url={`${resource}`}
										controls={true}
										width={'100%'}
										height={'auto'}
										style={{ aspectRatio: 16 / 9 }}
										onReady={() => {
											setInterval(() => {
												setIsLoaded(true);
											}, 80);
										}}
									/>
									{!isLoaded ? (
										<div className='absolute top-0 left-0 w-full aspect-video'>
											<Image
												src={thumbnail}
												alt={'will fixed'}
												width={960}
												height={540}
												priority
												className='absolute top-0 left-0 w-full aspect-video object-cover'
											/>
											<div className='absolute bg-[#000000] opacity-30 w-full h-full' />
											<div className='absolute w-full h-full flex justify-center items-center'>
												<div className='animate-spin-middle contrast-50 absolute w-[80px] aspect-square'>
													<Circles
														liMotion={{
															css: 'w-[calc(25px+100%)] border-[#eaeaea] border-2',
														}}
													/>
												</div>
											</div>
										</div>
									) : null}
								</>
							) : null}
							{category === 'outsource' ? (
								<>
									<div className='w-full h-full bg-green-500'>
										<YouTubePlayer
											url={`https://www.youtube.com/watch?v=${resource}`}
											controls={true}
											width={'auto'}
											height={'full'}
											style={{ aspectRatio: 16 / 9 }}
											onReady={() => {
												setInterval(() => {
													setIsLoaded(true);
												}, 80);
											}}
										/>
									</div>
									{!isLoaded ? (
										<div className='absolute top-0 left-0 w-full aspect-video'>
											<Image
												src={thumbnail}
												alt={'will fixed'}
												width={960}
												height={540}
												priority
												className='absolute top-0 left-0 w-full aspect-video object-cover'
											/>
											<div className='absolute bg-[#000000] opacity-30 w-full h-full' />
											<div className='absolute w-full h-full flex justify-center items-center'>
												<div className='animate-spin-middle contrast-50 absolute w-[80px] aspect-square'>
													<Circles
														liMotion={{
															css: 'w-[calc(25px+100%)] border-[#eaeaea] border-2',
														}}
													/>
												</div>
											</div>
										</div>
									) : null}
								</>
							) : null}
						</div>
						<div className='xl:min-w-[360px] xl:max-w-[500px] h-[300px] xl:h-auto xl:w-[calc(100vw-1500px)] px-8 flex flex-col items-center justify-between text-[#eaeaea]'>
							<div className='font-semibold text-xl self-start'>{title}</div>
							<div className='font-light text-sm leading-7 overflow-y-scroll scrollbar-hide max-h-[600px]'>
								{description ? description : null}
							</div>
							<div className='font-light text-sm self-end text-[#aaaaaa]'>
								{date}
							</div>
						</div>
					</div>
				</div>
				<button
					className='absolute m-2 top-4 right-4'
					onClick={() => {
						setOnDetail((p) => (p ? { ...p, isOpen: false } : undefined));
					}}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1}
						stroke='currentColor'
						className='w-10 h-10 stroke-[#707070]'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
			</div>
		</>
	);
};

const Video = ({
	index,
	waiting,
	thumbnail,
	title,
	description,
	category,
	resource,
	date,
	setOnDetail,
	setAnimationEnd,
}: VideoProps) => {
	const [titleScreen, setTitleScreen] = useState(false);
	const [cover, coverAnimate] = useAnimate();
	const [error, setError] = useState(false);
	const [ready, setReady] = useState(false);
	const [isVideoLoadable, setIsVideoLoadable] = useState(false);
	const [isIntersecting, setIsIntersecting] = useState(false);
	const videoRef = useRef<HTMLDivElement>(null);
	const handleIntersection = (entries: IntersectionObserverEntry[]) => {
		const [entry] = entries;
		if (entry.isIntersecting) {
			setIsIntersecting(true);
		}
	};
	useEffect(() => {
		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: '0px',
			threshold: 0.5,
		});
		if (videoRef.current) {
			observer.observe(videoRef.current);
		}
		return () => {
			if (videoRef.current) {
				observer.unobserve(videoRef.current);
			}
		};
	}, []);
	useEffect(() => {
		if (titleScreen) {
			const enterAnimaition = async () => {
				await coverAnimate(cover.current, { opacity: 0 }, { duration: 0.4 });
			};
			enterAnimaition();
		} else {
			const exitAnimation = async () => {
				await coverAnimate(
					cover.current,
					{ opacity: 1 },
					{ duration: 0.4, delay: 0.4 }
				);
			};
			exitAnimation();
		}
	}, [titleScreen, cover, coverAnimate]);
	const onAnimationComplete = () => {
		if (setAnimationEnd) {
			console.log('End Last Animation');
			setAnimationEnd((p) => (p = true));
		}
	};
	// console.log(waiting, setAnimationEnd ? 'yes' : 'nope');

	return (
		<>
			<motion.article
				initial={{ opacity: 0 }}
				animate={{
					opacity: [0, 1],
					y: [80, 0],
					transition: { delay: 0.2 + 0.08 * waiting },
				}}
				// exit={{ opacity: 0, y: [0, 40], transition: { duration: 0.2 } }}
				onAnimationComplete={onAnimationComplete}
				onMouseEnter={() => {
					setTitleScreen(true);
					setIsVideoLoadable(true);
				}}
				onMouseLeave={() => {
					setTitleScreen(false);
				}}
				onClick={() => {
					setOnDetail((p) => ({
						...p,
						isOpen: true,
						category,
						date,
						description,
						resource,
						title,
						imageUrl: thumbnail.url,
					}));
				}}
				key={index}
				className='relative overflow-hidden w-full flex justify-center items-center aspect-video sm:text-2xl text-[1.25rem] border cursor-pointer'
			>
				{category === 'film' || category === 'short' ? (
					<div ref={videoRef} className='absolute w-full aspect-video bg-black'>
						{isIntersecting && isVideoLoadable ? (
							<>
								<VimeoPlayer
									url={`${resource}&quality=540p`}
									controls={false}
									muted={true}
									playing={titleScreen}
									width={'100%'}
									height={'100%'}
									loop={true}
									onReady={() => {
										setReady(true);
									}}
								/>
								{!ready ? (
									<div className='absolute top-0 w-full h-full flex justify-center items-center'>
										<div className='animate-spin-middle contrast-50 absolute w-[54px] aspect-square'>
											<Circles
												liMotion={{
													css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
												}}
											/>
										</div>
									</div>
								) : null}
							</>
						) : null}
					</div>
				) : null}
				{category === 'outsource' ? (
					<div ref={videoRef} className='absolute w-full aspect-video'>
						{isIntersecting && isVideoLoadable ? (
							<>
								<YouTubePlayer
									url={`https://www.youtube.com/watch?v=${resource}`}
									controls={false}
									muted={true}
									playing={titleScreen}
									width={'100%'}
									height={'100%'}
									config={{
										embedOptions: { host: 'https://www.youtube-nocookie.com' },
									}}
									loop={true}
									onReady={() => {
										setReady(true);
									}}
								/>
								{!ready ? (
									<div className='absolute top-0 w-full h-full flex justify-center items-center'>
										<div className='animate-spin-middle contrast-50 absolute w-[54px] aspect-square'>
											<Circles
												liMotion={{
													css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
												}}
											/>
										</div>
									</div>
								) : null}
							</>
						) : null}
					</div>
				) : null}
				<div ref={cover} className='absolute w-full h-full '>
					<Image
						src={error ? thumbnail.alt : thumbnail.url}
						onError={() => {
							setError(true);
						}}
						alt={'will fixed'}
						width={thumbnail.width}
						height={thumbnail.height}
						priority
						className='relative w-full aspect-video object-cover'
					/>
					<div className='relative bg-[#101010] opacity-40 font-bold flex justify-center items-center pointer-events-none'></div>
				</div>
				<AnimatePresence>
					{titleScreen ? (
						<VideoTitlePresense title={title} description={description} />
					) : null}
				</AnimatePresence>
			</motion.article>
		</>
	);
};

export interface GapiItem {
	id: string;
	snippet: {
		description: string;
		thumbnails: {
			[key: string]: { url: string; width: number; height: number };
		};
		title: string;
		resourceId?: { videoId: string };
	};
}

interface VideoResponse {
	success: boolean;
	works: VideoResponseItem;
}

interface Videos {
	film: Works[];
	short: Works[];
	outsource: Works[];
}

const VideoSection = ({
	category,
	keywords,
	setOnDetail,
}: VideoSectionProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [videos, setVideos] = useState<Videos>({
		film: [],
		short: [],
		outsource: [],
	});
	const [videosInit, setVideosInit] = useState<Videos>();
	const [page, setPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [isAnimationEnd, setIsAnimationEnd] = useState(false);
	const perPage = 12;
	useEffect(() => {
		const getVideosInit = async () => {
			setIsLoading(true);
			const response: VideoResponse = await (
				await fetch(`/api/work/list?page=${page}&per_page=${perPage}`)
			).json();
			setVideos(response.works);
			setVideosInit(response.works);
			setHasNextPage(true);
			setPage(2);
			setIsLoading(false);
		};
		getVideosInit();
	}, []);
	console.log(isAnimationEnd);
	useEffect(() => {
		setIsAnimationEnd(false);
		console.log('restart animation');
		if (videosInit) {
			setVideos(videosInit);
			videosInit[category].length < 12
				? setHasNextPage(false)
				: setHasNextPage(true);
		}
		setPage(2);
	}, [category]);
	const updatePage = () => {
		if (!isAnimationEnd) return;
		if (!hasNextPage) return;
		const getVideos = async () => {
			setIsLoading(true);
			const response: VideoResponse = await (
				await fetch(
					`/api/work/list?page=${page}&per_page=${perPage}&category=${category}`
				)
			).json();
			console.log(response.works);
			if (response.works[category].length < perPage) {
				setHasNextPage(false);
			}
			setVideos((p) => ({
				...p,
				[category]: [...p[category], ...response.works[category]],
			}));
			setPage((p) => p + 1);
			setIsLoading(false);
		};
		getVideos();
	};
	const intersectionRef = useInfiniteScroll<string | number | boolean>({
		processIntersection: updatePage,
		dependencyArray: [category, page, hasNextPage, isAnimationEnd],
	});
	console.log(page);

	return (
		<section className='relative bg-[#101010]'>
			<div className='relative grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-9'>
				<AnimatePresence>
					{category === 'film'
						? videos?.film.map((data, idx) => {
								return (
									<div key={data.id}>
										<Video
											index={data.id.toString()}
											waiting={idx > 11 ? idx - (page - 2) * 12 : idx}
											thumbnail={{
												url: data.thumbnailLink,
												alt: data.thumbnailLink,
												width: 960,
												height: 540,
											}}
											title={data.title}
											description={data.description}
											category={category}
											resource={data.resourceId}
											date={data.date}
											setOnDetail={setOnDetail}
											setAnimationEnd={
												idx === videos.film.length - 1
													? setIsAnimationEnd
													: undefined
											}
										/>
									</div>
								);
						  })
						: null}
					{category === 'short'
						? videos?.short.map((data, idx) => (
								<div key={data.id}>
									<Video
										index={data.id.toString()}
										waiting={idx > 11 ? idx - (page - 2) * 12 : idx}
										thumbnail={{
											url: data.thumbnailLink,
											alt: data.thumbnailLink,
											width: 960,
											height: 540,
										}}
										title={data.title}
										description={data.description}
										category={category}
										resource={data.resourceId}
										date={data.date}
										setOnDetail={setOnDetail}
										setAnimationEnd={
											idx === videos.film.length - 1
												? setIsAnimationEnd
												: undefined
										}
									/>
								</div>
						  ))
						: null}
					{category === 'outsource'
						? videos?.outsource.map((data, idx) => (
								<div key={data.id}>
									<Video
										index={data.id.toString()}
										waiting={idx > 11 ? idx - (page - 2) * 12 : idx}
										thumbnail={{
											url: `https://i.ytimg.com/vi/${data.resourceId}/hqdefault.jpg`,
											alt: `https://i.ytimg.com/vi/${data.resourceId}/mqdefault.jpg`,
											width: 1280,
											height: 720,
										}}
										title={data.title}
										description={data.description}
										category={category}
										resource={data.resourceId}
										date={data.date}
										setOnDetail={setOnDetail}
										setAnimationEnd={
											idx === videos.film.length - 1
												? setIsAnimationEnd
												: undefined
										}
									/>
								</div>
						  ))
						: null}
				</AnimatePresence>
			</div>
			<div ref={intersectionRef} className='h-1' />
			{isLoading ? (
				<div className='relative w-full h-60 flex justify-center items-center'>
					<div className='animate-spin-middle contrast-50 absolute w-[40px] aspect-square'>
						<Circles
							liMotion={{
								css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
							}}
						/>
					</div>
				</div>
			) : null}
		</section>
	);
};

const OutroSection = () => {
	const letterRef = useRef(null);
	const isLetterInview = useInView(letterRef, {
		amount: 0.6,
		margin: '50% 0% 0% 0%',
	});
	const text = 'You can view my work here too.';
	const letter = Array.from(text);
	const [snsLinks, snsLinksAnimate] = useAnimate();
	const isLinksInview = useInView(snsLinks, {
		amount: 0.6,
		margin: '100% 0% 0% 0%',
	});
	const links = [
		{
			position: 'TopLink',
			name: 'INSTAGRAM',
			angle: -60,
			href: 'https://www.instagram.com/yarg__gray',
		},
		{
			position: 'MiddleLink',
			name: 'VIMEO',
			angle: -90,
			href: '',
		},
		{
			position: 'BottomLink',
			name: 'YOUTUBE',
			angle: -120,
			href: 'https://www.youtube.com/@insan8871',
		},
	];
	//타입스크립트에서 렌더링 없이 데이터변경 때문에 useRef쓸 때 타입 설정
	/* const textShadow = useRef<{ [key: string]: boolean }>({
		INSTAGRAM: true,
		VIMEO: true,
		YOUTUBE: true,
	}); */
	const onLinksEnter = (angle: number, selector: string) => {
		snsLinksAnimate('.Circles', { rotate: angle }, { duration: 0.4 });
		snsLinksAnimate(
			selector,
			{ color: '#eaeaea', webkitTextStroke: '0px' },
			{ duration: 0.2 }
		);
	};
	const onLinksLeave = (selector: string) => {
		snsLinksAnimate(
			selector,
			{
				color: '#101010',
				webkitTextStroke: '1px #9c9c9c',
			},
			{ duration: 0.2 }
		);
	};
	useEffect(() => {
		if (isLinksInview) {
			const enterAnimation = async () => {
				await snsLinksAnimate('.Circle-1', { scale: 1 }, { duration: 0.4 });
				snsLinksAnimate(
					'.Circle-0',
					{ y: [50, 50, 0], opacity: [0, 1, 1] },
					{ duration: 0.4, times: [0, 0.5, 1] }
				);
				await snsLinksAnimate(
					'.Circle-2',
					{ y: [-50, -50, 0], opacity: [0, 1, 1] },
					{ duration: 0.4, times: [0, 0.5, 1] }
				);
			};
			enterAnimation();
		} else {
			const leaveAnimation = async () => {
				snsLinksAnimate(
					'.Circle-0',
					{ y: [0, 50, 50], opacity: [1, 1, 0] },
					{ duration: 0.4, times: [0, 0.5, 1] }
				);
				await snsLinksAnimate(
					'.Circle-2',
					{ y: [0, -50, -50], opacity: [1, 1, 0] },
					{ duration: 0.4, times: [0, 0.5, 1] }
				);
				await snsLinksAnimate('.Circle-1', { scale: 2 }, { duration: 0.4 });
			};
			leaveAnimation();
		}
	}, [isLinksInview, snsLinksAnimate]);
	return (
		<section className='relative bg-[#101010] h-auto flex flex-col items-center font-bold'>
			<motion.div
				initial={'hidden'}
				animate={isLetterInview ? 'visible' : 'hidden'}
				variants={waveContainer}
				custom={0.05}
				ref={letterRef}
				className='text-[calc(10px+3vw)] h-[40vh] sm:h-[60vh] flex items-end'
			>
				{letter.map((letter, idx) => (
					<motion.span variants={waveChild} key={idx}>
						{letter === ' ' ? '\u00A0' : letter}
					</motion.span>
				))}
			</motion.div>
			<ul
				ref={snsLinks}
				className='text-[calc(40px+3.5vw)] h-[100vh] sm:h-[140vh] flex flex-col justify-center items-center text-[#101010]'
			>
				<motion.div initial={{ rotate: -60 }} className='Circles absolute'>
					{Array.from({ length: 3 }).map((_, idx) => (
						<motion.div
							key={idx}
							initial={{ scale: idx === 1 ? 2 : 1, opacity: idx === 1 ? 1 : 0 }}
							className={cls(
								idx === 1 ? 'z-[1]' : '',
								`Circle-${idx}`,
								'relative w-[calc(60px+17vw)] aspect-square rounded-full border border-[#9c9c9c] bg-[#101010]'
							)}
						/>
					))}
				</motion.div>
				{links.map((link) => (
					<Link key={link.name} href={link.href} target='_blank'>
						<motion.li
							style={{ WebkitTextStroke: '1px #9c9c9c' }}
							onMouseEnter={() => {
								onLinksEnter(link.angle, `.${link.position}`);
							}}
							onMouseLeave={() => {
								onLinksLeave(`.${link.position}`);
							}}
							className={cls(link.position, 'relative')}
						>
							{link.name}
						</motion.li>
					</Link>
				))}
			</ul>
		</section>
	);
};

export default function Work() {
	const [onDetail, setOnDetail] = useState<OnDetail>();
	const [category, setCategory] = useState<VideosCategory>('film');
	const section = useRef<HTMLDivElement>(null);
	console.log(section);
	const [keyWords, setKeyWords] = useState<keyWordsState>({
		searchWord: '',
		selectedTags: [''],
	});
	useEffect(() => {
		console.log(keyWords);
	}, [keyWords]);
	useEffect(() => {
		if (onDetail?.isOpen === true) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
		const currentScrollY = window.scrollY;
		console.log(currentScrollY);
	}, [onDetail]);
	return (
		<>
			<Layout
				seoTitle='Work'
				nav={{ isShort: true }}
				css={onDetail?.isOpen === true ? `invisible` : 'visible'}
			>
				<main
					ref={section}
					className='pt-[100px] font-GmarketSans overflow-x-hidden'
				>
					<TitleSection setCategory={setCategory} />
					<SearchSection setKeyWords={setKeyWords} />
					<VideoSection
						category={category}
						keywords={keyWords}
						setOnDetail={setOnDetail}
					/>
					<OutroSection />
					<ToTop toScroll={section} />
				</main>
			</Layout>
			{onDetail && onDetail.isOpen === true ? (
				<VideoDetail
					resource={onDetail.resource}
					category={category}
					date={onDetail.date}
					title={onDetail.title}
					setOnDetail={setOnDetail}
					thumbnail={onDetail.imageUrl}
				></VideoDetail>
			) : null}
		</>
	);
}
