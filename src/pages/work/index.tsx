import Circles from '@/components/circles';
import Layout from '@/components/layout';
import { cls, fetchApi, fetchYouTubeApi } from '@/libs/client/utils';
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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { waveChild, waveContainer } from '..';
import Input from '@/components/input';
import Image from 'next/image';
import { Works } from '@prisma/client';

interface TagButtonProps {
	tag: { name: string };
	css: string;
	onTagFunction: (tag: string) => void;
}

interface TitleSvgPresenseProps {
	explanation: string;
}

interface TitleSectionProps {
	setCategory: Dispatch<SetStateAction<'film' | 'short' | 'outsource'>>;
}

interface TagButtonSectionProps {
	setSelectedTags: Dispatch<SetStateAction<string[]>>;
}

interface SearchSectionProp {
	setKeyWords: Dispatch<SetStateAction<keyWordsState>>;
}

interface VideoSectionProps {
	category: 'film' | 'short' | 'outsource';
	keywords: keyWordsState;
}

interface VideoProps {
	index: string;
	waiting: number;
	thumbnail: { url: string; width: number; height: number };
	title: string;
	description: string;
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
	kind: 'film' | 'short' | 'outsource';
	count: number;
	idx: number;
	explanation: string;
};

const TitleSection = ({ setCategory }: TitleSectionProps) => {
	const [categoryState, setCategoryState] = useState<
		'film' | 'short' | 'outsource'
	>('film');
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
			<div className='Title'>{title}</div>
			<div className='Desc font-medium text-3xl'>description</div>
		</div>
	);
};

const Video = ({
	index,
	waiting,
	thumbnail,
	title,
	description,
}: VideoProps) => {
	const [titleScreen, setTitleScreen] = useState(false);
	const [cover, coverAnimate] = useAnimate();
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
					{ opacity: 0.4 },
					{ duration: 0.4, delay: 0.4 }
				);
			};
			exitAnimation();
		}
	}, [titleScreen, cover, coverAnimate]);
	return (
		<motion.article
			initial={{ opacity: 1 }}
			animate={{
				opacity: [0, 1],
				y: [80, 0],
				transition: { delay: 0.2 + 0.08 * waiting },
			}}
			exit={{ opacity: 0, y: [0, 40], transition: { duration: 0.2 } }}
			onMouseEnter={() => {
				setTitleScreen((p) => (p = true));
			}}
			onMouseLeave={() => {
				setTitleScreen((p) => (p = false));
			}}
			key={index}
			className='relative w-full flex justify-center items-center aspect-video text-5xl border'
		>
			<Image
				src={thumbnail.url}
				alt='thumbnail(will fixed)'
				width={thumbnail.width}
				height={thumbnail.height}
				priority
				className='relative w-full'
			/>
			<AnimatePresence>
				{titleScreen ? (
					<VideoTitlePresense title={title} description={description} />
				) : null}
			</AnimatePresence>
			<div
				ref={cover}
				className='absolute w-full h-full bg-[#101010] opacity-40 text-5xl font-bold flex justify-center items-center pointer-events-none'
			></div>
		</motion.article>
	);
};

interface videoGenreState {
	category: 'film' | 'short' | 'outsource';
	id: string;
	thumbnails: { url: string; width: number; height: number };
	title: string;
	description: string;
}

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

interface GapiLists {
	items: {
		id: string;
		snippet: {
			title: string;
		};
	}[];
}

const VideoSection = ({ category, keywords }: VideoSectionProps) => {
	const videoDatas = [
		{ category: 'film', direction: 'horizental', index: 1 },
		{ category: 'short', direction: 'vertical', index: 2 },
		{ category: 'film', direction: 'horizental', index: 3 },
		{ category: 'short', direction: 'vertical', index: 4 },
		{ category: 'short', direction: 'vertical', index: 5 },
		{ category: 'film', direction: 'horizental', index: 6 },
		{ category: 'film', direction: 'horizental', index: 7 },
		{ category: 'short', direction: 'vertical', index: 8 },
		{ category: 'film', direction: 'horizental', index: 9 },
		{ category: 'short', direction: 'vertical', index: 10 },
		{ category: 'film', direction: 'horizental', index: 11 },
		{ category: 'short', direction: 'vertical', index: 12 },
		{ category: 'outsource', direction: 'horizental', index: 13 },
		{ category: 'film', direction: 'horizental', index: 14 },
		{ category: 'film', direction: 'horizental', index: 15 },
		{ category: 'short', direction: 'vertical', index: 16 },
		{ category: 'outsource', direction: 'horizental', index: 17 },
		{ category: 'outsource', direction: 'horizental', index: 18 },
		{ category: 'film', direction: 'horizental', index: 19 },
		{ category: 'short', direction: 'vertical', index: 20 },
	];
	const newVideoDatas = {
		film: videoDatas.filter((data) => data.category === 'film'),
		short: videoDatas.filter((data) => data.category === 'short'),
		outsource: videoDatas.filter((data) => data.category === 'outsource'),
	};
	// const youtube = (category: 'film' | 'short' | 'outsource') => {
	// 	fetch(
	// 		`https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&channelId=UCwy8JhA4eDumalKwKrvrxQA&type=video&fields=(nextPageToken,items(id,snippet(title,channelTitle,description,thumbnails)))`
	// 	)
	// 		.then((response) => response.json())
	// 		.then((data) => {
	// 			const { items } = data;
	// 			const newItems: videoGenreState[] = items.map((element: GapiItems) => {
	// 				const newItem: videoGenreState = {
	// 					category,
	// 					id: element.id.videoId,
	// 					thumbnails: element.snippet.thumbnails.default,
	// 					description: element.snippet.description,
	// 					title: element.snippet.title,
	// 				};
	// 				return newItem;
	// 			});
	// 			setVideos((p) => ({ ...p, [category]: newItems }));
	// 		});
	// };
	const [items, setItems] = useState<GapiItem[]>([]);
	const [videos, setVideos] = useState<{ success: boolean; work: Works[] }>();
	const [playlistIds, setPlaylistIds] = useState<GapiLists>();
	useEffect(() => {
		fetchYouTubeApi(
			'playlists',
			'10',
			setPlaylistIds,
			'(items(id,snippet(title)))'
		);
	}, []);
	useEffect(() => {
		if (!playlistIds) return;
		if (category === 'film') {
			setItems((p) => (p = []));
			playlistIds.items.forEach((item) => {
				if (
					item.snippet.title !== 'shorts' &&
					item.snippet.title !== '참여 촬영'
				)
					fetchYouTubeApi(
						'playlistItems',
						'9',
						(data: { items: GapiItem[] }) => {
							setItems((p) => [...p, ...data.items]);
						},
						'(items(id,snippet(title,description,thumbnails)))',
						item.id
					);
			});
		} else if (category === 'short') {
			setItems((p) => (p = []));
			playlistIds.items.forEach((item) => {
				if (item.snippet.title === 'shorts')
					fetchYouTubeApi(
						'playlistItems',
						'9',
						(data: { items: GapiItem[] }) => {
							setItems((p) => [...p, ...data.items]);
						},
						'(items(id,snippet(title,description,thumbnails)))',
						item.id
					);
			});
		} else if (category === 'outsource') {
			setItems((p) => (p = []));
			fetchApi('/api/work/list?kind=outsource', setVideos);
		}
	}, [playlistIds, category]);
	console.log(items);
	return (
		<section className='relative grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 bg-[#101010] px-9'>
			<AnimatePresence>
				{category === 'outsource'
					? videos?.work?.map((data, idx) => (
							<Video
								key={idx}
								index={data.id.toString()}
								waiting={idx}
								thumbnail={{
									url: `https://i.ytimg.com/vi/${data.resourceId}/maxresdefault.jpg`,
									width: 1280,
									height: 720,
								}}
								title={data.title}
								description={data.description}
							/>
					  ))
					: items.map((data, idx) => (
							<Video
								key={idx}
								index={data.id}
								waiting={idx}
								thumbnail={data.snippet.thumbnails.high}
								title={data.snippet.title}
								description={data.snippet.description}
							/>
					  ))}
				{/* {['film', 'short', 'outsource'].map((data) =>
					category === data
						? (newVideoDatas as datas)[data].map((arr, idx) => (
								<Video key={arr.index} index={arr.index} waiting={idx} />
						  ))
						: null
				)} */}
			</AnimatePresence>
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
	const [category, setCategory] = useState<'film' | 'short' | 'outsource'>(
		'film'
	);
	const [keyWords, setKeyWords] = useState<keyWordsState>({
		searchWord: '',
		selectedTags: [''],
	});
	useEffect(() => {
		console.log(keyWords);
	}, [keyWords]);
	return (
		<Layout seoTitle='Work' nav={{ isShort: true }}>
			<main className='pt-[100px] font-GmarketSans overflow-x-hidden'>
				<TitleSection setCategory={setCategory} />
				<SearchSection setKeyWords={setKeyWords} />
				<VideoSection category={category} keywords={keyWords} />
				<OutroSection />
			</main>
		</Layout>
	);
}
