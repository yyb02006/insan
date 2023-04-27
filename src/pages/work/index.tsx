import Circles from '@/components/circles';
import Layout from '@/components/layout';
import { cls } from '@/libs/client/utils';
import {
	motion,
	AnimatePresence,
	useAnimate,
	usePresence,
} from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

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
}

const TitleSvgPresense = ({ explanation }: TitleSvgPresenseProps) => {
	const [chevron, animate] = useAnimate();
	const [isPresent, safeToRemove] = usePresence();
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await animate(
					chevron.current,
					{ x: [40, 0], opacity: 1 },
					{ duration: 0.3 }
				);
				await animate('div', { opacity: [0, 1] }, { duration: 0.1 });
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				await animate(
					chevron.current,
					{ x: [0, 40], opacity: 0 },
					{ duration: 0.3 }
				);
				await animate('div', { opacity: [1, 0] }, { duration: 0.1 });
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent]);
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
			<div className='text-lg opacity-0 ml-2 mt-1'>{explanation}</div>
		</div>
	);
};

const TitleSection = ({ setCategory }: TitleSectionProps) => {
	const [categoryState, setCategoryState] = useState('film');
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
		<section className='relative inline-block'>
			<motion.div
				style={{ rotate: rotate.current }}
				className={
					'absolute w-[400%] h-full right-0 flex items-center -mr-32 transition-transform duration-1000'
				}
			>
				<Circles liMotion={{ css: 'w-[calc(140px+100%)]' }} />
			</motion.div>
			<div className='relative text-[9rem] font-bold leading-none'>
				<span className='font-light'>60 </span>
				<span>Works</span>
			</div>
			{categories.map((category) => (
				<div
					key={category.idx}
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
					<div className='relative text-[2rem] leading-tight'>
						<div className='inline-block pr-3'>{category.count} </div>
						{category.title}
					</div>
					<AnimatePresence>
						{categoryState === category.kind ? (
							<TitleSvgPresense explanation={category.explanation} />
						) : null}
					</AnimatePresence>
				</div>
			))}
		</section>
	);
};

const TagButton = ({ tag, css, onTagFunction }: TagButtonProps) => {
	const [isPresent, safeToRemove] = usePresence();
	const [button, animate] = useAnimate();
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await animate(
					button.current,
					{ y: [-20, 0], opacity: [0, 1] },
					{ duration: 0.2, delay: 0.1 }
				);
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				await animate(
					button.current,
					{ y: [0, -20], opacity: [1, 0] },
					{ duration: 0.1 }
				);
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent]);
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
		<section className='relative bg-[#101010] py-6 flex justify-between'>
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
		<section className='mt-[10vh] font-bold flex gap-2 pb-2 border-b border-[#9a9a9a] text-lg leading-tight text-[#eaeaea]'>
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
	}, [isPresent]);
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

const Video = ({ index }: VideoProps) => {
	const [titleScreen, setTitleScreen] = useState(false);
	const [thumnail, animate] = useAnimate();
	useEffect(() => {
		if (titleScreen) {
			const enterAnimaition = async () => {
				await animate(thumnail.current, { opacity: 0 }, { duration: 0.4 });
			};
			enterAnimaition();
		} else {
			const exitAnimation = async () => {
				await animate(
					thumnail.current,
					{ opacity: 1 },
					{ duration: 0.4, delay: 0.4 }
				);
			};
			exitAnimation();
		}
	}, [titleScreen]);
	return (
		<article
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
				Thumnail
			</div>
		</article>
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
	/* const testover = (index: number) => {
		ref.current[index].style.zIndex = '1';
	};
	const testout = (index: number) => {
		ref.current[index].style.zIndex = '0';
	}; */
	return (
		<section className='relative grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1'>
			{videoDatas.map((data) =>
				data.category === category ? <Video index={data.index} /> : null
			)}
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

export default function Work() {
	const [category, setCategory] = useState('');
	return (
		<Layout seoTitle='Works' nav={{ isShort: true }}>
			<main className='pt-[100px] font-GmarketSans'>
				<div className='p-9'>
					<TitleSection setCategory={setCategory} />
					<SearchSection />
					<TagButtonSection />
					<VideoSection category={category} />
				</div>
			</main>
		</Layout>
	);
}
