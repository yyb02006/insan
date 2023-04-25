import Layout from '@/components/layout';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const VideoSection = () => {
	return <section></section>;
};

interface TagButtonProps {
	tag: { name: string; isSelected: boolean };
	onTagFunction: (tag: string) => void;
}

const TagButton = ({ tag, onTagFunction }: TagButtonProps) => {
	return (
		<div>
			<button
				key={tag.name}
				onClick={() => {
					onTagFunction(tag.name);
				}}
				className='border border-[#9a9a9a] rounded-full p-2 hover:border-palettered hover:text-palettered transition-colors duration-200'
			>
				{tag.name}
			</button>
		</div>
	);
};

const TagSection = () => {
	const [tags, setTags] = useState({
		selected: ['All'],
		notSelected: [
			{ name: 'All', isSelected: true },
			{ name: 'Movie', isSelected: false },
			{ name: 'Advertisement', isSelected: false },
			{ name: 'film', isSelected: false },
		],
	});
	const onTagInsert = (tag: string) => {
		setTags(
			(p) =>
				(p = {
					selected: [...p.selected, tag],
					notSelected: p.notSelected.map((arr) => ({
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
					notSelected: p.notSelected.map((arr) => ({
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
				{tags.selected.map((tag) => (
					<button
						key={tag}
						onClick={() => {
							onTagDelete(tag);
						}}
						className='border border-palettered rounded-full p-2'
					>
						{tag}
					</button>
				))}
			</div>
			<div className='flex font-medium text-[#bababa] leading-none text-sm gap-2'>
				{tags.notSelected.map((tag) =>
					!tag.isSelected ? (
						<AnimatePresence>
							<TagButton tag={tag} onTagFunction={onTagInsert} />
						</AnimatePresence>
					) : null
				)}
			</div>
		</section>
	);
};

const SearchSection = () => {
	return (
		<section className='mt-[10vh] font-light flex gap-2 pb-2 border-b border-[#9a9a9a] text-[#bababa]'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={1.5}
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
					<TagSection />
					<VideoSection />
				</div>
			</main>
		</Layout>
	);
}
