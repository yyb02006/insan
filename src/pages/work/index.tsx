import Layout from '@/components/layout';
import { cls } from '@/libs/client/utils';
import {
	motion,
	AnimatePresence,
	useAnimate,
	usePresence,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Circles from '@/components/circles';

const VideoSection = () => {
	const ref = useRef<HTMLDivElement[]>([]);
	const videoDatas = [
		{ direction: 'horizental', index: 1 },
		{ direction: 'vertical', index: 2 },
		{ direction: 'horizental', index: 3 },
		{ direction: 'horizental', index: 4 },
		{ direction: 'vertical', index: 5 },
		{ direction: 'horizental', index: 6 },
		{ direction: 'vertical', index: 7 },
		{ direction: 'vertical', index: 8 },
		{ direction: 'horizental', index: 9 },
		{ direction: 'vertical', index: 10 },
		{ direction: 'vertical', index: 11 },
		{ direction: 'vertical', index: 12 },
		{ direction: 'horizental', index: 13 },
		{ direction: 'vertical', index: 14 },
	];
	const testover = (index: number) => {
		ref.current[index].style.zIndex = '1';
	};
	const testout = (index: number) => {
		ref.current[index].style.zIndex = '0';
	};
	return (
		<section className='relative w-full h-auto xl:grid-cols-4 md:grid-cols-2 grid-cols-1'>
			<div className='flex flex-wrap grow gap-2 w-full'>
				{videoDatas.map((arr) => (
					<div
						key={arr.index}
						className={cls(
							arr.direction === 'horizental'
								? 'aspect-[16/9] grow-[256] '
								: 'aspect-[9/16] grow-[81]',
							'lg:min-h-[500px] sm:h-[300px] h-[200px] bg-indigo-500'
						)}
					>
						{arr.index}
					</div>
				))}
			</div>
		</section>
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

interface TagButtonProps {
	tag: { name: string };
	css: string;
	onTagFunction: (tag: string) => void;
}

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
		<section className='py-6 flex justify-between'>
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

interface TitleSvgPresenseProps {
	explanation: string;
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

const TitleSection = () => {
	const [categoryState, setCategoryState] = useState('film');
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
	return (
		<section className='inline-block'>
			<div className='text-[9rem] font-bold leading-none'>
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

export default function Work() {
	return (
		<Layout seoTitle='Works' nav={{ isShort: true }}>
			<main className='pt-[100px] font-GmarketSans'>
				<div className='p-9'>
					<TitleSection />
					<SearchSection />
					<TagButtonSection />
					<VideoSection />
				</div>
			</main>
		</Layout>
	);
}
