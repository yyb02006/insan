import { SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { WorkInfos } from './write';
import { cls, fetchApi } from '@/libs/client/utils';
import Image from 'next/image';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Link from 'next/link';
import Input from '@/components/input';

interface list extends WorkInfos {
	id: number;
}

interface listState extends list {
	selected: boolean;
}

interface dataState {
	success: boolean;
	list: list[];
}

interface ThumbnailProps {
	src: { main: string; sub: string };
}

const Thumbnail = ({ src }: ThumbnailProps) => {
	const [error, setError] = useState(false);
	const handleImageError = () => {
		setError(true);
	};
	return (
		<Image
			src={!error ? src.main : src.sub}
			alt='picturesAlter'
			width={1280}
			height={720}
			priority
			onError={handleImageError}
			className='w-full object-cover aspect-video'
		/>
	);
};

interface ControlorProps {
	onReset: () => void;
	onSubmitDelete: () => void;
}

const Controlor = ({ onReset, onSubmitDelete }: ControlorProps) => {
	return (
		<div className='sm:w-[60px] flex sm:block h-14 sm:h-auto w-full sm:ring-1 sm:ring-palettered sm:rounded-full fixed xl:right-20 sm:right-4 right-0 sm:top-[100px] sm:bottom-auto bottom-0'>
			<button
				onClick={onReset}
				className='w-full ring-1 ring-palettered aspect-square sm:rounded-full bg-[#101010] sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
			>
				Reset
			</button>
			<button
				onClick={onSubmitDelete}
				className='w-full ring-1 ring-palettered aspect-square bg-palettered sm:bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
			>
				Delete
			</button>
		</div>
	);
};

interface WorksProps {
	setDeleteIdList: (value: SetStateAction<number[]>) => void;
	setSearchResult: (
		value: SetStateAction<{
			outsource: listState[];
			film: listState[];
		}>
	) => void;
	searchResult: {
		outsource: listState[];
		film: listState[];
	};
	category: 'outsource' | 'film';
	id: number;
	selected: boolean;
	resourceId: string;
	title: string;
	thumbnailLink: string;
}

const Works = ({
	category,
	id,
	selected,
	resourceId,
	title,
	setDeleteIdList,
	setSearchResult,
	searchResult,
	thumbnailLink,
}: WorksProps) => {
	return (
		<div
			className={cls(selected ? 'ring-2' : 'ring-0', 'ring-palettered')}
			onClick={() => {
				setDeleteIdList((p) => [...p, id]);
				setSearchResult((p) => ({
					...p,
					[category]: p[category].map((list) =>
						list.id === id ? { ...list, selected: !list.selected } : list
					),
				}));
			}}
		>
			<Thumbnail
				src={
					searchResult[category].length !== 0
						? category === 'outsource'
							? {
									main: `https://i.ytimg.com/vi/${resourceId}/maxresdefault.jpg`,
									sub: `https://i.ytimg.com/vi/${resourceId}/hqdefault.jpg`,
							  }
							: {
									main: thumbnailLink,
									sub: thumbnailLink,
							  }
						: { main: '', sub: '' }
				}
			/>
			<div className='mt-2'>
				<div className='text-sm'>Title : {title}</div>
				<div className='text-xs font-light'>Id : {resourceId}</div>
			</div>
		</div>
	);
};

export default function Delete() {
	const router = useRouter();
	const [category, setCategory] = useState<'film&short' | 'outsource'>(
		'film&short'
	);
	const [searchWord, setSearchWord] = useState('');
	const [searchResult, setSearchResult] = useState<{
		outsource: listState[];
		film: listState[];
	}>({ outsource: [], film: [] });
	const [list, setList] = useState<{
		outsource: listState[];
		film: listState[];
	}>({ outsource: [], film: [] });
	const [send, { loading, data }] = useMutation<{ success: boolean }>(
		'/api/work'
	);
	const [deleteIdList, setDeleteIdList] = useState<number[]>([]);
	const props = category === 'outsource' ? 'outsource' : 'film';
	useEffect(() => {
		fetchApi(
			'/api/work',
			(data: dataState) =>
				setList((p) => ({
					film: data.list
						.filter(
							(arr) => arr.category === 'film' || arr.category === 'short'
						)
						.map((list) => ({ ...list, selected: false })),
					outsource: data.list
						.filter((arr) => arr.category === 'outsource')
						.map((list) => ({ ...list, selected: false })),
				})),
			{ method: 'GET' }
		);
	}, []);
	useEffect(() => {
		setDeleteIdList([]);
	}, [category]);
	useEffect(() => {
		if (data?.success) {
			router.push('/work/write');
		}
	}, [router, data]);
	useEffect(() => {
		setSearchResult((p) => ({
			...p,
			[props]: list[props],
		}));
	}, [list, category]);
	const onSubmitDelete = () => {
		if (loading) return;
		if (category === 'film&short') {
			send(
				searchResult?.film
					.filter((list) => list.selected === true)
					.map((list) => list.id)
			);
		} else if (category === 'outsource') {
			send(
				searchResult?.outsource
					.filter((list) => list.selected === true)
					.map((list) => list.id)
			);
		}
	};
	const onReset = () => {
		setDeleteIdList([]);
		setList((p) => ({
			...p,
			[props]: p[props].map((arr) => ({ ...arr, selected: false })),
		}));
	};
	const onSearch = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!searchWord) return;
		setSearchResult((p) => ({
			...p,
			[props]: list?.outsource.filter(
				(el) =>
					el.title.includes(searchWord) ||
					el.resourceId.toLowerCase().includes(searchWord.toLowerCase())
			),
		}));
	};
	console.log(list);
	console.log(searchResult);
	return (
		<Layout
			seoTitle='Delete'
			footerPosition='hidden'
			nav={{ isShort: true }}
			menu={false}
		>
			<section className='relative xl:px-40 sm:px-24 px-16'>
				<div className='h-[100px] flex items-center justify-center font-GmarketSans font-bold text-3xl'>
					삭제하기
				</div>
				<div className='fixed right-0 top-0 mr-[40px] md:mr-[60px] h-[100px] flex items-center text-sm'>
					<Link href={'/work/write'}>추가하기</Link>
				</div>
				<div className='flex py-4'>
					<button
						onClick={() => {
							setCategory('film&short');
						}}
						className={cls(
							category === 'film&short' ? 'text-palettered' : '',
							'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
						)}
					>
						Film / Short
					</button>
					<button
						onClick={() => {
							setCategory('outsource');
						}}
						className={cls(
							category === 'outsource' ? 'text-palettered' : '',
							'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
						)}
					>
						Outsource
					</button>
				</div>
				<form
					onSubmit={onSearch}
					className='relative mb-8 font-light flex items-center gap-2 pb-1 border-b border-[#9a9a9a] text-lg leading-tight text-[#eaeaea]'
				>
					<button type='submit'>
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
						onChange={(e: SyntheticEvent<HTMLInputElement>) => {
							setSearchWord(e.currentTarget.value);
						}}
					/>
				</form>
				{category === 'film&short' ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
						{searchResult.film.map((li) => (
							<Works
								key={li.id}
								category={props}
								id={li.id}
								selected={li.selected}
								resourceId={li.resourceId}
								title={li.title}
								thumbnailLink={li.thumbnailLink}
								setDeleteIdList={setDeleteIdList}
								setSearchResult={setSearchResult}
								searchResult={searchResult}
							/>
						))}
						<Controlor onReset={onReset} onSubmitDelete={onSubmitDelete} />
					</div>
				) : null}
				{category === 'outsource' ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
						{searchResult.outsource.map((li) => (
							<Works
								key={li.id}
								category={props}
								id={li.id}
								selected={li.selected}
								resourceId={li.resourceId}
								title={li.title}
								thumbnailLink={li.thumbnailLink}
								setDeleteIdList={setDeleteIdList}
								setSearchResult={setSearchResult}
								searchResult={searchResult}
							/>
						))}
						<Controlor onReset={onReset} onSubmitDelete={onSubmitDelete} />
					</div>
				) : (
					''
				)}
			</section>
		</Layout>
	);
}
