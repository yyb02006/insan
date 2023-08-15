import { SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { FlatformsCategory, WorkInfos } from './write';
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
	onClick: () => void;
	searchResult: searchResultItems;
	category: FlatformsCategory;
	selected: boolean;
	resourceId: string;
	title: string;
	thumbnailLink: string;
}

const Works = ({
	category,
	selected,
	resourceId,
	title,
	onClick,
	searchResult,
	thumbnailLink,
}: WorksProps) => {
	return (
		<div
			className={cls(selected ? 'ring-2' : 'ring-0', 'ring-palettered')}
			onClick={onClick}
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

interface MenuBarProps {
	currentPage: 'write' | 'delete';
}

export const MenuBar = ({ currentPage = 'write' }: MenuBarProps) => {
	return (
		<>
			<div className='h-[100px] flex items-center justify-center font-GmarketSans font-bold text-3xl'>
				{currentPage === 'write' ? (
					<span>추가하기</span>
				) : (
					<span>삭제하기</span>
				)}
			</div>
			<div className='absolute right-0 top-0 mr-[40px] md:mr-[60px] h-[100px] flex items-center text-sm'>
				<Link href={`/work/${currentPage === 'write' ? 'delete' : 'write'}`}>
					{currentPage === 'write' ? (
						<span>삭제하기</span>
					) : (
						<span>추가하기</span>
					)}
				</Link>
			</div>
		</>
	);
};

interface CategoryTabProps {
	onFilmShortClick: () => void;
	onOutsourceClick: () => void;
	category: FlatformsCategory;
}

export const CategoryTab = ({
	onFilmShortClick,
	onOutsourceClick,
	category,
}: CategoryTabProps) => {
	return (
		<div className='flex py-4'>
			<button
				onClick={onFilmShortClick}
				className={cls(
					category === 'filmShort' ? 'text-palettered' : '',
					'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
				)}
			>
				Film / Short
			</button>
			<button
				onClick={onOutsourceClick}
				className={cls(
					category === 'outsource' ? 'text-palettered' : '',
					'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
				)}
			>
				Outsource
			</button>
		</div>
	);
};

interface SearchFormProps {
	onSearch: (e: SyntheticEvent<HTMLFormElement>) => void;
	setSearchWord: (value: SetStateAction<string>) => void;
	searchWord: string;
}

export const SearchForm = ({
	onSearch,
	setSearchWord,
	searchWord,
}: SearchFormProps) => {
	return (
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
				value={searchWord}
			/>
		</form>
	);
};

interface searchResultItems {
	outsource: list[];
	filmShort: list[];
}

export default function Delete() {
	const router = useRouter();
	const [category, setCategory] = useState<FlatformsCategory>('filmShort');
	const [searchWord, setSearchWord] = useState('');
	const [searchResult, setSearchResult] = useState<searchResultItems>({
		outsource: [],
		filmShort: [],
	});
	const [list, setList] = useState<searchResultItems>({
		outsource: [],
		filmShort: [],
	});
	const [send, { loading, data }] = useMutation<{ success: boolean }>(
		'/api/work'
	);
	const [deleteIdList, setDeleteIdList] = useState<number[]>([]);
	useEffect(() => {
		fetchApi(
			'/api/work',
			(data: dataState) => {
				setList((p) => ({
					filmShort: data.list.filter(
						(arr) => arr.category === 'film' || arr.category === 'short'
					),
					outsource: data.list.filter((arr) => arr.category === 'outsource'),
				}));
				setSearchResult((p) => ({
					...p,
					[category]: data.list.filter((arr) => {
						if (category === 'filmShort') {
							return arr.category === 'film' || arr.category === 'short';
						} else {
							return arr.category === 'outsource';
						}
					}),
				}));
			},
			{ method: 'GET' }
		);
	}, []);
	useEffect(() => {
		setDeleteIdList([]);
		if (list[category].length > 0) {
			setSearchResult((p) => ({
				...p,
				[category]: list[category],
			}));
		}
	}, [category]);
	useEffect(() => {
		if (data?.success) {
			router.push('/work/write');
		}
	}, [router, data]);
	const onSubmitDelete = () => {
		if (loading) return;
		send(deleteIdList);
	};
	const onReset = () => {
		setDeleteIdList([]);
		setSearchResult((p) => ({ ...p, [category]: list[category] }));
	};
	const onUpdatedListClick = () => {
		if (!deleteIdList || deleteIdList?.length < 1) return;
		setSearchResult((p) => ({
			...p,
			[category]: list[category].filter((li) => deleteIdList.includes(li.id)),
		}));
	};
	const onSearch = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (typeof searchWord === undefined) return;
		setSearchResult((p) => ({
			...p,
			[category]: list[category].filter(
				(el) =>
					el.title.includes(searchWord) ||
					el.resourceId.toLowerCase().includes(searchWord.toLowerCase())
			),
		}));
	};
	const onClick = (id: number) => {
		setDeleteIdList((p) =>
			p.includes(id) ? p.filter((item) => item !== id) : [...p, id]
		);
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
				<MenuBar currentPage='delete' />
				<CategoryTab
					category={category}
					onFilmShortClick={() => {
						setCategory('filmShort');
					}}
					onOutsourceClick={() => {
						setCategory('outsource');
					}}
				/>
				<SearchForm
					onSearch={onSearch}
					setSearchWord={setSearchWord}
					searchWord={searchWord}
				/>
				{category === 'filmShort' ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
						{searchResult.filmShort.map((li) => (
							<Works
								key={li.id}
								category={category}
								selected={deleteIdList.includes(li.id)}
								resourceId={li.resourceId}
								title={li.title}
								thumbnailLink={li.thumbnailLink}
								onClick={() => {
									onClick(li.id);
								}}
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
								category={category}
								selected={deleteIdList.includes(li.id)}
								resourceId={li.resourceId}
								title={li.title}
								thumbnailLink={li.thumbnailLink}
								onClick={() => {
									onClick(li.id);
								}}
								searchResult={searchResult}
							/>
						))}
						<Controlor onReset={onReset} onSubmitDelete={onSubmitDelete} />
					</div>
				) : null}
				<button
					onClick={onUpdatedListClick}
					className='fixed sm:hidden bottom-24 right-4 w-16 rounded-full bg-[#101010] ring-1 ring-palettered aspect-square sm:rounded-full sm:font-light font bold text-sm sm:hover:text-palettered sm:hover:font-bold'
				>
					<div>{deleteIdList ? deleteIdList.length : '0'}</div>
					<div>Lists</div>
				</button>
				<div className='sm:w-[60px] flex sm:block h-14 sm:h-auto w-full sm:ring-1 sm:ring-palettered sm:rounded-full fixed xl:right-20 sm:right-4 right-0 sm:top-[100px] sm:bottom-auto bottom-0'>
					<button
						onClick={onReset}
						className='w-full ring-1 ring-palettered aspect-square bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
					>
						Reset
					</button>
					<button
						onClick={onSubmitDelete}
						className='w-full ring-1 ring-palettered aspect-square bg-palettered sm:bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
					>
						Save
					</button>
					<button
						onClick={onUpdatedListClick}
						className='hidden sm:inline-block w-full ring-1 ring-palettered aspect-square sm:rounded-full sm:font-light font bold text-sm sm:hover:text-palettered sm:hover:font-bold'
					>
						<div>{deleteIdList ? deleteIdList.length : '0'}</div>
						<div>Lists</div>
					</button>
				</div>
			</section>
		</Layout>
	);
}
