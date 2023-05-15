import Circles from '@/components/circles';
import Layout from '@/components/layout';
import { cls } from '@/libs/client/utils';
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

interface TagButtonProps {
	tag: { name: string };
	css: string;
	onTagFunction: (tag: string) => void;
}

interface TitleSvgPresenseProps {
	explanation: string;
}

interface TitleSectionProps {
	setCategory: Dispatch<SetStateAction<string>>;
}

interface VideoSectionProps {
	category: string;
}

interface VideoProps {
	index: number;
	waiting: number;
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

const TitleSection = ({ setCategory }: TitleSectionProps) => {
	const [categoryState, setCategoryState] = useState('film');
	const dataLength = useRef(389);
	const rotate = useRef(0);
	const categories = [
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

const TagButtonSection = () => {
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
	/* useEffect(() => {
		if (tags.selected.length > 1 && tags.selected.includes('all')) {
			setTags(
				(p) =>
					(p = {
						selected: p.selected.filter((arr) => arr !== 'all'),
						notSelected: p.notSelected.map((arr) => ({
							name: arr.name,
							isSelected: arr.name === 'all' ? false : arr.isSelected,
						})),
					})
			);
		}
	}, [tags]); */
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

const SearchSection = () => {
	return (
		<section className='mt-[10vh] mx-9 font-bold flex gap-2 pb-2 border-b border-[#9a9a9a] text-lg leading-tight text-[#eaeaea]'>
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
			search
		</section>
	);
};

const VideoTitlePresense = () => {
	const [title, animate] = useAnimate();
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
			ref={title}
			className='absolute w-full h-[40%] flex flex-col justify-center items-center font-bold pointer-events-none'
		>
			<div className='Title'>Video Title</div>
			<div className='Desc font-medium text-3xl'>Description</div>
		</div>
	);
};

const Video = ({ index, waiting }: VideoProps) => {
	const [titleScreen, setTitleScreen] = useState(false);
	const [thumnail, thumnailAnimate] = useAnimate();
	useEffect(() => {
		if (titleScreen) {
			const enterAnimaition = async () => {
				await thumnailAnimate(
					thumnail.current,
					{ opacity: 0 },
					{ duration: 0.4 }
				);
			};
			enterAnimaition();
		} else {
			const exitAnimation = async () => {
				await thumnailAnimate(
					thumnail.current,
					{ opacity: 1 },
					{ duration: 0.4, delay: 0.4 }
				);
			};
			exitAnimation();
		}
	}, [titleScreen, thumnail, thumnailAnimate]);
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
			className='relative flex justify-center items-center aspect-video text-5xl bg-pink-400 border'
		>
			<button className='absolute w-32 aspect-square bg-indigo-400'></button>
			<AnimatePresence>
				{titleScreen ? <VideoTitlePresense /> : null}
			</AnimatePresence>
			<div
				ref={thumnail}
				className='relative w-full h-full bg-amber-400 text-5xl font-bold flex justify-center items-center pointer-events-none'
			>
				Thumnail{index}
			</div>
		</motion.article>
	);
};

const VideoSection = ({ category }: VideoSectionProps) => {
	// const ref = useRef<HTMLDivElement[]>([]);
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
	const newDatas = {
		film: videoDatas.filter((data) => data.category === 'film'),
		short: videoDatas.filter((data) => data.category === 'short'),
		outsource: videoDatas.filter((data) => data.category === 'outsource'),
	};
	type test = typeof newDatas & {
		[key: string]: { category: string; direction: string; index: number }[];
	};
	/* const testover = (index: number) => {
		ref.current[index].style.zIndex = '1';
	};
	const testout = (index: number) => {
		ref.current[index].style.zIndex = '0';
	}; */
	return (
		<section className='relative grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 bg-[#101010] px-9'>
			<AnimatePresence>
				{['film', 'short', 'outsource'].map((data) =>
					category === data
						? (newDatas as test)[data].map((arr, idx) => (
								<Video key={arr.index} index={arr.index} waiting={idx} />
						  ))
						: null
				)}
			</AnimatePresence>
		</section>
		/**Layout 3 플렉스로 조절(서로 다른 비율의 영상이나 사진을 함께 보여주는 최적의 방법) */
		/* <section className='relative w-full h-auto'>
			<div className='flex flex-wrap grow gap-2 w-full'>
				{videoDatas.map((arr) => (
					<div
						key={arr.index}
						className={cls(
							arr.direction === 'horizental'
								? 'aspect-[16/9] grow-[256]'
								: 'aspect-[9/16] grow-[81]',
							'lg:min-h-[400px] h-full sm:min-h-[220px] min-h-[200px] bg-indigo-500'
						)}
					>
						{arr.index}
					</div>
				))}
			</div>
		</section> */
		/**Layout 2 마우스오버시 늘리기 */
		/* <section className='relative w-full h-auto gap-2 grid auto-rows-auto grid-flow-dense bg-green-500 xl:grid-cols-4 md:grid-cols-2 grid-cols-1'>
			{videoDatas.map((data) => {
				if (data.direction === 'horizental') {
					return data.index % 4 === 0 ? (
						<div key={data.index} className='relative w-full aspect-[1/1] '>
							<div
								onMouseOver={() => {
									testover(data.index - 1);
								}}
								onMouseOut={() => {
									testout(data.index - 1);
								}}
								ref={(el) =>
									el !== null ? (ref.current[data.index - 1] = el) : null
								}
								className={
									'absolute right-0 h-full aspect-square bg-pink-500 border-4 border-[#eaeaea] transition-all duration-400 hover:delay-300 hover:aspect-[16/9]'
								}
							>
								{data.index}
							</div>
						</div>
					) : (
						<div key={data.index} className='relative w-full aspect-[1/1] '>
							<div
								onMouseOver={() => {
									testover(data.index - 1);
								}}
								onMouseOut={() => {
									testout(data.index - 1);
								}}
								ref={(el) =>
									el !== null ? (ref.current[data.index - 1] = el) : null
								}
								className={
									'absolute h-full aspect-square bg-pink-500 border-4 border-[#eaeaea] transition-all duration-400 hover:delay-300 hover:aspect-[16/9]'
								}
							>
								{data.index}
							</div>
						</div>
					);
				} else if (data.direction === 'vertical') {
					return (
						<div key={data.index} className='relative w-full aspect-[1/1] '>
							<div
								onMouseOver={() => {
									testover(data.index - 1);
								}}
								onMouseOut={() => {
									testout(data.index - 1);
								}}
								ref={(el) =>
									el !== null ? (ref.current[data.index - 1] = el) : null
								}
								className={
									'absolute w-full aspect-square bg-pink-500 border-4 border-[#eaeaea] transition-all duration-400 hover:delay-300 hover:aspect-[9/16]'
								}
							>
								{data.index}
							</div>
						</div>
					);
				}
			})}
		</section> */
		/**Layout 1 자동 배치 */
		/* <section className='w-full h-auto gap-2 grid auto-rows-auto grid-flow-dense bg-green-500 xl:grid-cols-3 md:grid-cols-2'>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400 text-3xl'>
				1
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400 text-3xl'>
				2
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400 text-3xl'>
				3
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400 text-3xl'>
				4
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400 text-3xl'>
				5
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400 text-3xl'>
				6
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400 text-3xl'>
				7
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400 text-3xl'>
				8
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400 text-3xl'>
				9
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400 text-3xl'>
				10
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400 text-3xl'>
				11
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400 text-3xl'>
				12
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400 text-3xl'>
				13
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400 text-3xl'>
				14
			</div>
		</section> */
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
					<Link href={link.href} target='_blank'>
						<motion.li
							style={{ WebkitTextStroke: '1px #9c9c9c' }}
							key={link.name}
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
	const [category, setCategory] = useState('');
	return (
		<Layout seoTitle='Work' nav={{ isShort: true }}>
			<main className='pt-[100px] font-GmarketSans overflow-x-hidden'>
				<TitleSection setCategory={setCategory} />
				<SearchSection />
				<TagButtonSection />
				<VideoSection category={category} />
				<OutroSection />
			</main>
		</Layout>
	);
}
