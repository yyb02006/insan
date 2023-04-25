import Layout from '@/components/layout';
import { cls } from '@/libs/client/utils';
import { AnimatePresence, useAnimate, usePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const VideoSection = () => {
	return (
		<section className='w-full h-auto gap-2 grid grid-cols-4 auto-rows-auto grid-flow-dense bg-green-500'>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400'>
				1
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400'>
				2
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400'>
				3
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400'>
				4
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400'>
				5
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400'>
				6
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400'>
				7
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400'>
				8
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400'>
				9
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400'>
				10
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400'>
				11
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400'>
				12
			</div>
			<div className='w-full h-full aspect-[2/1] col-[auto_/_span_2] row-[auto_/_span_1] bg-indigo-400'>
				13
			</div>
			<div className='w-full h-full aspect-[1/2] col-[auto_/_span_1] row-[auto_/_span_2] bg-indigo-400'>
				14
			</div>
		</section>
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
			{ name: 'Movie', isSelected: false },
			{ name: 'Advertisement', isSelected: false },
			{ name: 'film', isSelected: false },
			{ name: '16 : 9', isSelected: false },
			{ name: '1 : 1', isSelected: false },
			{ name: '9 : 16', isSelected: false },
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
		<section className='py-3 flex justify-between'>
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

const TitleSection = () => {
	const works = [
		{ kind: 'Movies', count: 25 },
		{ kind: 'Reels', count: 22 },
		{ kind: 'Advertisements', count: 13 },
	];
	return (
		<section>
			<div className='text-[9rem] font-bold leading-none'>
				<span className='font-light'>60 </span>
				<span>Works</span>
			</div>
			{works.map((arr, idx) => (
				<div
					key={idx}
					className='text-[2rem] text-[#bababa] font-light leading-tight'
				>
					<span>{arr.count} </span>
					{arr.kind}
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
