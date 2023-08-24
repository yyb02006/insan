import { ciIncludes, fetchData } from '@/libs/client/utils';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { GapiItem, VideosCategory } from '.';
import useMutation from '@/libs/client/useMutation';
import Layout from '@/components/layout';
import {
	VimeoThumbnailFeed,
	YoutubeThumbnailFeed,
} from '@/components/thumbnailFeed';
import useInfiniteScrollFromFlatform from '@/libs/client/useInfiniteScroll';
import { useRouter } from 'next/router';
import {
	ButtonsController,
	CategoryTab,
	MenuBar,
	SearchForm,
	SelectedListButton,
	VideoCollection,
} from './delete';
import ToTop from '@/components/toTop';
import { GetStaticProps } from 'next';
import client from '@/libs/server/client';
import Circles from '@/components/circles';

export interface WorkInfos {
	title: string;
	description: string;
	resourceId: string;
	category: string;
	date: string;
	thumbnailLink: string;
}

export interface VimeoVideos {
	player_embed_url: string;
	resource_key: string;
	pictures: { sizes: { link: string }[] };
	name: string;
	description: string;
}

export interface OwnedVideoItems {
	title: string;
	category: VideosCategory;
	date: string;
	description: string;
	resourceId: string;
}

export type ResourceHost = 'vimeo' | 'youtube';

export type FlatformsCategory = 'filmShort' | 'outsource';

interface InitialData {
	initialVimeoVideos: VimeoVideos[];
	initialYoutubeVideos: GapiItem[];
	initialOwnedVideos: VideoCollection<OwnedVideoItems[]>;
}

export default function Write({
	initialVimeoVideos,
	initialYoutubeVideos,
	initialOwnedVideos,
}: InitialData) {
	const router = useRouter();
	const topElement = useRef<HTMLDivElement>(null);
	const [category, setCategory] = useState<FlatformsCategory>('filmShort');
	const [searchWord, setSearchWord] = useState('');
	const [searchWordSnapshot, setSearchWordSnapshot] = useState('');
	const [searchResult, setSearchResult] = useState<
		VideoCollection<VimeoVideos[], GapiItem[]>
	>({
		filmShort: initialVimeoVideos,
		outsource: initialYoutubeVideos,
	});
	const [list, setList] = useState<VideoCollection<VimeoVideos[], GapiItem[]>>({
		filmShort: initialVimeoVideos,
		outsource: initialYoutubeVideos,
	});
	const [sendList, { loading, data, error }] = useMutation<{
		success: boolean;
	}>(`/api/work/write`);
	const [workInfos, setWorkInfos] = useState<WorkInfos[]>([]);
	const [fetchLoading, setFetchLoading] = useState(false);
	const ownedVideos: VideoCollection<OwnedVideoItems[]> = initialOwnedVideos;
	const [page, setPage] = useState(2);
	const [onSelectedList, setOnSelectedList] = useState(false);
	const intersectionRef = useInfiniteScrollFromFlatform({
		setList,
		setSearchResult,
		setFetchLoading,
		category,
		onSelectedList,
		page,
		setPage,
		snapshot: searchWordSnapshot,
		searchResultsCount: searchResult[category].length,
	});

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
		setWorkInfos([]);
		setPage(2);
		setSearchWordSnapshot('');
		setSearchWord('');
		setSearchResult((p) => ({
			...p,
			[category === 'filmShort' ? 'outsource' : 'filmShort']:
				list[category === 'filmShort' ? 'outsource' : 'filmShort'],
		}));
	}, [category]);

	const inputBlur = (e: SyntheticEvent<HTMLInputElement>) => {
		const {
			name,
			value,
			dataset: { resourceid },
		} = e.currentTarget;
		const workIdx = workInfos?.findIndex((i) => i.resourceId === resourceid);
		if (workIdx !== undefined && workIdx >= 0) {
			if (name == 'title' && value === '') {
				setWorkInfos((p) => p.filter((arr) => arr.resourceId !== resourceid));
			}
		}
	};

	const inputChange = (e: SyntheticEvent<HTMLInputElement>) => {
		const { value, name, dataset, type } = e.currentTarget;
		const workIdx = workInfos?.findIndex(
			(i) => i.resourceId === dataset.resourceid
		);
		if (workIdx !== undefined && workIdx >= 0) {
			if (name === 'title') {
				setWorkInfos((p) =>
					p.map((arr) =>
						arr.resourceId === dataset.resourceid
							? { ...arr, title: value }
							: arr
					)
				);
			} else if (name === 'description') {
				setWorkInfos((p) =>
					p.map((arr) =>
						arr.resourceId === dataset.resourceid
							? { ...arr, description: value }
							: arr
					)
				);
			} else if (name === 'date') {
				setWorkInfos((p) =>
					p.map((arr) =>
						arr.resourceId === dataset.resourceid
							? { ...arr, date: value }
							: arr
					)
				);
			} else if (type === 'radio') {
				setWorkInfos((p) =>
					p.map((arr) =>
						arr.resourceId === dataset.resourceid
							? { ...arr, category: value }
							: arr
					)
				);
			}
		} else {
			if (name === 'title') {
				setWorkInfos((p) => [
					...p,
					{
						resourceId: dataset.resourceid ? dataset.resourceid : '',
						title: value,
						description: dataset.description ? dataset.description : '',
						category: dataset.category ? dataset.category : '',
						date: dataset.date ? dataset.date : '',
						thumbnailLink: dataset.thumbnail ? dataset.thumbnail : '',
					},
				]);
			}
		}
	};

	const onSubmitWrites = () => {
		if (loading) return;
		sendList({
			data: workInfos,
			secret: process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN,
		});
	};

	const onReset = () => {
		setOnSelectedList(false);
		setWorkInfos([]);
		setSearchResult((p) => ({
			...p,
			[category]: list[category],
		}));
	};

	const onSearch = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPage(2);
		setSearchWordSnapshot(searchWord);
		const filterResources = (kind: FlatformsCategory) => {
			if (kind === 'filmShort') {
				setSearchResult((p) => ({
					...p,
					[kind]: list[kind].filter(
						(el) =>
							ciIncludes(el.name, searchWord) ||
							ciIncludes(el.resource_key, searchWord)
					),
				}));
			} else if (kind === 'outsource') {
				setSearchResult((p) => ({
					...p,
					[kind]: list[kind].filter(
						(el) =>
							ciIncludes(el.snippet.title, searchWord) ||
							ciIncludes(el.snippet.resourceId?.videoId || '', searchWord)
					),
				}));
			}
		};
		filterResources(category);
	};

	const onSelectedListClick = () => {
		setOnSelectedList(true);
		if (!workInfos || workInfos?.length < 1) return;
		if (category === 'filmShort') {
			setSearchResult((p) => ({
				...p,
				[category]: list[category].filter((info) =>
					workInfos?.some((video) => video.resourceId === info.player_embed_url)
				),
			}));
		} else if (category === 'outsource') {
			setSearchResult((p) => ({
				...p,
				[category]: list[category].filter((info) =>
					workInfos?.some(
						(video) => video.resourceId === info.snippet.resourceId?.videoId
					)
				),
			}));
		}
	};

	return (
		<Layout
			seoTitle='Write'
			footerPosition='hidden'
			nav={{ isShort: true }}
			menu={false}
		>
			<section ref={topElement} className='relative xl:px-40 sm:px-24 px-16'>
				<MenuBar currentPage='write' />
				<CategoryTab
					category={category}
					onFilmShortClick={() => {
						setCategory('filmShort');
						setWorkInfos([]);
					}}
					onOutsourceClick={() => {
						setCategory('outsource');
						setWorkInfos([]);
					}}
				/>
				<SearchForm
					onSearch={onSearch}
					searchWord={searchWord}
					setSearchWord={setSearchWord}
				/>
				{category === 'filmShort' && list[category].length > 0 ? (
					<VimeoThumbnailFeed
						inputChange={inputChange}
						inputBlur={inputBlur}
						resource={searchResult[category]}
						workInfos={workInfos}
						intersectionRef={intersectionRef}
						fetchLoading={fetchLoading}
						ownedVideos={ownedVideos[category]}
						page={page}
					></VimeoThumbnailFeed>
				) : null}
				{category === 'outsource' ? (
					<YoutubeThumbnailFeed
						inputChange={inputChange}
						resource={searchResult[category]}
						workInfos={workInfos}
						intersectionRef={intersectionRef}
						fetchLoading={fetchLoading}
						ownedVideos={ownedVideos[category]}
						inputBlur={inputBlur}
						page={page}
					></YoutubeThumbnailFeed>
				) : null}
				<SelectedListButton
					onClick={onSelectedListClick}
					count={workInfos ? workInfos?.length : 0}
					isMobile={true}
				/>
				<ButtonsController
					onReset={onReset}
					onSave={onSubmitWrites}
					onSort={onSelectedListClick}
					count={workInfos ? workInfos?.length : 0}
					action='save'
				/>
			</section>
			<ToTop toScroll={topElement} />
			{loading ? (
				<div className='fixed top-0 w-screen h-screen opacity-60 z-[1] flex justify-center items-center bg-black'>
					<div className='animate-spin-middle contrast-50 absolute w-[100px] aspect-square'>
						<Circles
							liMotion={{
								css: 'w-[calc(16px+100%)] border-[#eaeaea] border-1',
							}}
						/>
					</div>
				</div>
			) : null}
			{error ? (
				<div className='fixed top-0 w-screen h-screen z-[1] flex justify-center items-center'>
					<div className='absolute top-0 w-full h-full opacity-60 bg-black' />
					<div className='relative text-[#eaeaea] font-bold text-3xl lg:w-1/2 w-auto lg:px-0 px-6 leading-snug'>
						인산아 <span className='text-palettered'>세이브</span> 도중 에러가
						생겼단다 ㅎㅎ 아마도 새로고침하고 다시 해보면 되겠지만 그전에 나에게
						보고하도록
					</div>
				</div>
			) : null}
		</Layout>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const perPage = 6;
	const VimeoVideos = await fetchData(
		`https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.sizes.link,name,description&page=1&per_page=12`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
			},
		}
	);

	const YoutubeVideos = await Promise.all(
		[
			'PL3Sx9O__-BGnKsABX4khAMW6BBFF_Hf40',
			'PL3Sx9O__-BGlyWzd0DnpZT9suTNy4kBW1',
		].map((id) =>
			fetchData(
				`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=${perPage}&part=snippet&fields=(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)`
			)
		)
	);

	const lists = await client.works.findMany({
		select: {
			title: true,
			category: true,
			date: true,
			description: true,
			resourceId: true,
		},
	});

	const initialOwnedVideos = {
		filmShort: lists.filter(
			(list) => list.category === 'film' || list.category === 'short'
		),
		outsource: lists.filter((list) => list.category === 'outsource'),
	};

	return {
		props: {
			initialVimeoVideos: VimeoVideos.data,
			initialYoutubeVideos: [
				...YoutubeVideos[0].items,
				...YoutubeVideos[1].items,
			],
			initialOwnedVideos,
		},
		revalidate: 86400,
	};
};
