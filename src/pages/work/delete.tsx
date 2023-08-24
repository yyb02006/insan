import {
	SetStateAction,
	SyntheticEvent,
	useEffect,
	useRef,
	useState,
} from 'react';
import { FlatformsCategory, WorkInfos } from './write';
import { ciIncludes, cls } from '@/libs/client/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Link from 'next/link';
import Input from '@/components/input';
import { useInfiniteScroll } from '@/libs/client/useInfiniteScroll';
import useDeleteRequest from '@/libs/client/useDelete';
import ToTop from '@/components/toTop';
import { GetStaticProps } from 'next';
import client from '@/libs/server/client';
import { Works } from '@prisma/client';
import Circles from '@/components/circles';

interface list extends WorkInfos {
	id: number;
}

interface dataState {
	success: boolean;
	works: { film: list[]; short: list[]; outsource: list[] };
}

interface ThumbnailProps {
	src: { main: string; sub: string };
	setPriority: boolean;
}

const Thumbnail = ({ src, setPriority }: ThumbnailProps) => {
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
			onError={handleImageError}
			className='w-full object-cover aspect-video'
			priority={setPriority}
		/>
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

interface SelectedListButtonProps {
	onClick: () => void;
	count: number;
	isMobile: boolean;
}

export const SelectedListButton = ({
	onClick,
	count,
	isMobile,
}: SelectedListButtonProps) => {
	return (
		<button
			onClick={onClick}
			className={cls(
				isMobile
					? 'fixed sm:hidden bottom-24 right-4 w-16  bg-[#101010] font-bold '
					: 'hidden sm:inline-block w-full font-light hover:text-palettered hover:font-bold',
				'ring-1 ring-palettered aspect-square text-sm rounded-full'
			)}
		>
			<div>{count}</div>
			<div>Lists</div>
		</button>
	);
};

interface ButtonsControllerProps {
	onReset: () => void;
	onSave: () => void;
	onSort: () => void;
	count: number;
	action?: 'save' | 'delete';
}

export const ButtonsController = ({
	onReset,
	onSave,
	onSort,
	count,
	action = 'save',
}: ButtonsControllerProps) => {
	return (
		<div className='sm:w-[60px] flex sm:block h-14 sm:h-auto w-full sm:ring-1 sm:ring-palettered sm:rounded-full fixed xl:right-20 sm:right-4 right-0 sm:top-[100px] sm:bottom-auto bottom-0'>
			<button
				onClick={onReset}
				className='w-full ring-1 ring-palettered aspect-square bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
			>
				Reset
			</button>
			<button
				onClick={onSave}
				className='w-full ring-1 ring-palettered aspect-square bg-palettered sm:bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
			>
				{action === 'save' ? <span>save</span> : <span>delete</span>}
			</button>
			<SelectedListButton
				onClick={onSort}
				count={count}
				isMobile={false}
			></SelectedListButton>
		</div>
	);
};

interface WorkProps {
	onClick: () => void;
	searchResult: VideoCollection<Works[]>;
	category: FlatformsCategory;
	selected: boolean;
	resourceId: string;
	title: string;
	thumbnailLink: string;
	setPriority: boolean;
}

const Work = ({
	category,
	selected,
	resourceId,
	title,
	onClick,
	searchResult,
	thumbnailLink,
	setPriority,
}: WorkProps) => {
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
				setPriority={setPriority}
			/>
			<div className='mt-2'>
				<div className='text-sm'>Title : {title}</div>
				<div className='text-xs font-light break-words'>
					<span className='whitespace-nowrap'>Id : </span>
					{resourceId}
				</div>
			</div>
		</div>
	);
};

export interface VideoCollection<T, U = T> {
	filmShort: T;
	outsource: U;
}

interface InitialData {
	initialWorks: VideoCollection<Works[]>;
	initialHasNextPage: VideoCollection<boolean>;
}

export default function Delete({
	initialWorks,
	initialHasNextPage,
}: InitialData) {
	const router = useRouter();
	const topElement = useRef<HTMLDivElement>(null);
	const [category, setCategory] = useState<FlatformsCategory>('filmShort');
	const [searchWord, setSearchWord] = useState('');
	const [searchWordSnapShot, setSearchWordSnapShot] = useState('');
	const [searchResult, setSearchResult] =
		useState<VideoCollection<Works[]>>(initialWorks);
	const [searchResultSnapShot, setSearchResultSnapShot] = useState<
		VideoCollection<Works[]>
	>({
		filmShort: [],
		outsource: [],
	});
	const [list, setList] = useState<VideoCollection<Works[]>>(initialWorks);
	const [send, { loading, data, error }] = useDeleteRequest<{
		success: boolean;
	}>(`/api/work?secret=${process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN}`);
	const [deleteIdList, setDeleteIdList] = useState<number[]>([]);
	const [page, setPage] = useState(2);
	const [apiPage, setApiPage] = useState<{
		filmShort: number;
		outsource: number;
	}>({ filmShort: 2, outsource: 2 });
	const perPage = 12;
	const [onSelectedList, setOnSelectedList] = useState(false);
	const [fetchLoading, setFetchLoading] = useState(false);
	const [hasNextPage, setHasNextPage] =
		useState<VideoCollection<boolean>>(initialHasNextPage);

	useEffect(() => {
		if (data && data?.success) {
			router.push('/work');
		} else if (data && !data?.success) {
			const timeOut = setTimeout(() => {
				router.push('/work');
			}, 3000);
			return () => clearTimeout(timeOut);
		}
	}, [data]);

	useEffect(() => {
		setOnSelectedList(false);
		setDeleteIdList([]);
		setPage(2);
		setSearchWordSnapShot('');
		setSearchWord('');
		setSearchResult((p) => ({
			...p,
			[category === 'filmShort' ? 'outsource' : 'filmShort']:
				list[category === 'filmShort' ? 'outsource' : 'filmShort'],
		}));
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
		setOnSelectedList(false);
		setPage(2);
		setDeleteIdList([]);
		setSearchResult((p) => ({ ...p, [category]: list[category] }));
		setSearchWordSnapShot('');
	};

	const onSelectedListClick = () => {
		setOnSelectedList(true);
		setPage(2);
		if (!deleteIdList || deleteIdList?.length < 1) return;
		setSearchResultSnapShot((p) => ({
			...p,
			[category]: list[category].filter((li) => deleteIdList.includes(li.id)),
		}));
		setSearchResult((p) => ({
			...p,
			[category]: list[category].filter((li) => deleteIdList.includes(li.id)),
		}));
	};

	const onSearch = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPage(2);
		if (typeof searchWord === undefined) return;
		setSearchWordSnapShot(searchWord);
		if (onSelectedList) {
			setSearchResult((p) => ({
				...p,
				[category]: searchResultSnapShot[category].filter(
					(result) =>
						ciIncludes(result.title, searchWord) ||
						ciIncludes(result.resourceId, searchWord)
				),
			}));
		} else {
			setSearchResult((p) => ({
				...p,
				[category]: list[category].filter(
					(li) =>
						ciIncludes(li.title, searchWord) ||
						ciIncludes(li.resourceId, searchWord)
				),
			}));
		}
	};

	const onWorkClick = (id: number) => {
		setDeleteIdList((p) =>
			p.includes(id) ? p.filter((item) => item !== id) : [...p, id]
		);
	};

	const processIntersection = () => {
		const getList = async () => {
			setFetchLoading(true);
			const lists: dataState = await (
				await fetch(
					`/api/work/list?page=${apiPage[category]}&per_page=${perPage}&category=${category}`
				)
			).json();
			if (
				lists.works[category === 'filmShort' ? 'film' : 'outsource'].length <
				perPage
			) {
				setHasNextPage((p) => ({ ...p, [category]: false }));
			}
			setList((p) => ({
				...p,
				[category]: [
					...p[category],
					...lists.works[category === 'filmShort' ? 'film' : 'outsource'],
				],
			}));
			setSearchResult((p) => ({
				...p,
				[category]: [
					...p[category],
					...lists.works[
						category === 'filmShort' ? 'film' : 'outsource'
					].filter(
						(li) =>
							ciIncludes(li.title, searchWordSnapShot) ||
							ciIncludes(li.resourceId, searchWordSnapShot)
					),
				],
			}));
			setFetchLoading(false);
			setApiPage((p) => ({ ...p, [category]: p[category] + 1 }));
		};
		if (fetchLoading) return;
		if (!onSelectedList && hasNextPage[category] && apiPage[category] <= page) {
			getList();
		}
		if (page <= searchResult[category].length / perPage + 1) {
			setPage((p) => p + 1);
		}
	};

	const intersectionRef = useInfiniteScroll({
		processIntersection,
		dependencyArray: [page, fetchLoading],
	});

	return (
		<Layout
			seoTitle='Delete'
			footerPosition='hidden'
			nav={{ isShort: true }}
			menu={false}
		>
			<section ref={topElement} className='relative xl:px-40 sm:px-24 px-16'>
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
				<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
					{searchResult[category].map((li, index) =>
						index < 12 * (page - 1) ? (
							<Work
								key={li.id}
								category={category}
								selected={deleteIdList.includes(li.id)}
								resourceId={li.resourceId}
								title={li.title}
								thumbnailLink={li.thumbnailLink}
								onClick={() => {
									onWorkClick(li.id);
								}}
								searchResult={searchResult}
								setPriority={index < 6 ? true : false}
							/>
						) : null
					)}
				</div>
				<div ref={intersectionRef} className='w-full h-1 mt-20' />
				{fetchLoading ? (
					<div className='relative w-full h-20 flex justify-center items-center mb-20'>
						<div className='animate-spin-middle contrast-50 absolute w-[40px] aspect-square'>
							<Circles
								liMotion={{
									css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
								}}
							/>
						</div>
					</div>
				) : null}

				<SelectedListButton
					onClick={onSelectedListClick}
					count={deleteIdList.length}
					isMobile={true}
				/>
				<ButtonsController
					onReset={onReset}
					onSave={onSubmitDelete}
					onSort={onSelectedListClick}
					count={deleteIdList.length}
					action='delete'
				/>
				<ToTop toScroll={topElement} />
			</section>
			{loading ? (
				<div className='fixed top-0 w-screen h-screen opacity-60 z-[1] bg-black'>
					<div className='absolute top-0 w-full h-full flex justify-center items-center'>
						<div className='animate-spin-middle contrast-50 absolute w-[100px] aspect-square'>
							<Circles
								liMotion={{
									css: 'w-[calc(16px+100%)] border-[#eaeaea] border-1',
								}}
							/>
						</div>
					</div>
				</div>
			) : null}
			{error ? (
				<div className='fixed top-0 w-screen h-screen z-[1] flex justify-center items-center'>
					<div className='absolute top-0 w-full h-full opacity-60 bg-black' />
					<div className='relative text-[#eaeaea] font-bold text-3xl lg:w-1/2 w-auto lg:px-0 px-6 leading-snug'>
						인산아 <span className='text-palettered'>딜리트</span> 도중 에러가
						생겼단다 ㅎㅎ 아마도 새로고침하고 다시 해보면 되겠지만 그전에 나에게
						보고하도록
					</div>
				</div>
			) : null}
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const initialWorks = {
		filmShort: await client.works.findMany({
			where: { OR: [{ category: 'film' }, { category: 'short' }] },
			take: 12,
		}),
		outsource: await client.works.findMany({
			where: { category: 'outsource' },
			take: 12,
		}),
	};
	let initialHasNextPage = { filmShort: false, outsource: false };
	for (const count in initialWorks) {
		initialWorks[count as FlatformsCategory].length < 12
			? (initialHasNextPage[count as FlatformsCategory] = false)
			: (initialHasNextPage[count as FlatformsCategory] = true);
	}
	return {
		props: {
			initialWorks: JSON.parse(JSON.stringify(initialWorks)),
			initialHasNextPage,
		},
	};
};
