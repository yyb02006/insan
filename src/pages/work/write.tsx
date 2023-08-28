import { ciIncludes, fetchData } from '@/libs/client/utils';
import Image from 'next/image';
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
	animatedThumbnailLink: string;
}

export interface VimeoVideos {
	player_embed_url: string;
	resource_key: string;
	pictures: { base_link: string };
	name: string;
	description: string;
	uri: string;
	animated_thumbnail: string;
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
	initialNextPageToken: string;
}

export default function Write({
	initialVimeoVideos,
	initialYoutubeVideos,
	initialOwnedVideos,
	initialNextPageToken,
}: InitialData) {
	const router = useRouter();
	const topElement = useRef<HTMLDivElement>(null);
	const [category, setCategory] = useState<FlatformsCategory>('filmShort');
	const [searchWord, setSearchWord] = useState('');
	const [searchWordSnapshot, setSearchWordSnapshot] = useState('');
	const [searchResults, setSearchResults] = useState<
		VideoCollection<VimeoVideos[], GapiItem[]>
	>({
		filmShort: initialVimeoVideos,
		outsource: initialYoutubeVideos,
	});
	const [searchResultsSnapshot, setSearchResultsSnapshot] = useState<
		VideoCollection<VimeoVideos[], GapiItem[]>
	>({ filmShort: [], outsource: [] });
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
		setSearchResults,
		setFetchLoading,
		category,
		onSelectedList,
		page,
		setPage,
		snapshot: searchWordSnapshot,
		searchResultsCount: searchResults[category].length,
		initialNextPageToken,
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
		setSearchResults((p) => ({
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
						resourceId: dataset.resourceid || '',
						title: value,
						description: dataset.description || '',
						category: dataset.category
							? dataset.category
							: category === 'filmShort'
							? ''
							: 'outsource',
						date: dataset.date || '',
						thumbnailLink: dataset.thumbnail || '',
						animatedThumbnailLink: dataset.animated_thumbnail || '',
					},
				]);
			}
		}
	};

	const onSubmitWrites = () => {
		const inspectedWorkInfos = workInfos.filter(
			(info) => info.title.length !== 0
		);
		if (loading && inspectedWorkInfos.length > 0) return;
		sendList({
			data: inspectedWorkInfos,
			secret: process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN,
		});
	};

	const onSearch = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPage(2);
		setSearchWordSnapshot(searchWord);
		if (onSelectedList) {
			if (category === 'filmShort') {
				setSearchResults((p) => ({
					...p,
					[category]: searchResultsSnapshot[category].filter((el) =>
						ciIncludes(el.name, searchWord)
					),
				}));
			} else if (category === 'outsource') {
				setSearchResults((p) => ({
					...p,
					[category]: searchResultsSnapshot[category].filter((el) =>
						ciIncludes(el.snippet.title, searchWord)
					),
				}));
			}
		} else {
			if (category === 'filmShort') {
				setSearchResults((p) => ({
					...p,
					[category]: list[category].filter((el) =>
						ciIncludes(el.name, searchWord)
					),
				}));
			} else if (category === 'outsource') {
				setSearchResults((p) => ({
					...p,
					[category]: list[category].filter((el) =>
						ciIncludes(el.snippet.title, searchWord)
					),
				}));
			}
		}
	};

	const resetInit = () => {
		setOnSelectedList(false);
		setPage(2);
		setSearchWord('');
		setSearchWordSnapshot('');
		setSearchResults((p) => ({
			...p,
			[category]: list[category],
		}));
		setSearchResultsSnapshot((p) => ({ ...p, [category]: [] }));
	};

	const onReset = () => {
		if (workInfos.length > 0) {
			setWorkInfos([]);
			resetInit();
			topElement.current?.scrollIntoView();
		}
	};

	const onSelectedListClick = () => {
		if (onSelectedList) {
			resetInit();
		} else {
			const inspectedWorkInfos = workInfos.filter(
				(info) => info.title.length !== 0
			);
			if (!workInfos || inspectedWorkInfos?.length < 1) return;
			setPage(2);
			setSearchWord('');
			setSearchWordSnapshot('');
			setOnSelectedList(true);
			topElement.current?.scrollIntoView();
			if (category === 'filmShort') {
				setSearchResults((p) => ({
					...p,
					[category]: list[category].filter((info) =>
						inspectedWorkInfos?.some(
							(video) => video.resourceId === info.player_embed_url
						)
					),
				}));
				setSearchResultsSnapshot((p) => ({
					...p,
					[category]: list[category].filter((info) =>
						inspectedWorkInfos?.some(
							(video) => video.resourceId === info.player_embed_url
						)
					),
				}));
			} else if (category === 'outsource') {
				setSearchResults((p) => ({
					...p,
					[category]: list[category].filter((info) =>
						inspectedWorkInfos?.some(
							(video) => video.resourceId === info.snippet.resourceId?.videoId
						)
					),
				}));
				setSearchResultsSnapshot((p) => ({
					...p,
					[category]: list[category].filter((info) =>
						inspectedWorkInfos?.some(
							(video) => video.resourceId === info.snippet.resourceId?.videoId
						)
					),
				}));
			}
		}
	};
	console.log(initialYoutubeVideos);
	console.log(initialNextPageToken);

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
						resource={searchResults[category]}
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
						resource={searchResults[category]}
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
					isOnMobile={true}
					onSelectedList={onSelectedList}
				/>
				<ButtonsController
					onReset={onReset}
					onSave={onSubmitWrites}
					onSort={onSelectedListClick}
					onSelectedList={onSelectedList}
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
			{data?.success ? (
				<div className='fixed top-0 w-screen h-screen z-[1]'></div>
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
	const perPage = 12;
	const vimeoVideos = await fetchData(
		`https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.base_link,name,description&page=1&per_page=${perPage}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
			},
		}
	);

	const mergedVimeoVideos = await Promise.all(
		vimeoVideos.data.map(async (el: VimeoVideos) => {
			const data = (
				await fetchData(
					`https://api.vimeo.com${el.uri}/animated_thumbsets?fields=sizes.link,sizes.profile_id`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
						},
					}
				)
			).data;
			return {
				...el,
				animated_thumbnail:
					data[0]?.sizes?.find(
						(el: { profile_id: string; link: string }) =>
							el.profile_id === 'Low'
					)?.link || 'no-link',
			};
		})
	);

	const youtubePlaylistId = 'PL3Sx9O__-BGlt-FYFXIO15RbxFwegMs8C';

	const youtubeVideos = await fetchData(
		`https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${youtubePlaylistId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=${perPage}&part=snippet&fields=(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)`
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
			initialVimeoVideos: mergedVimeoVideos,
			initialYoutubeVideos: youtubeVideos.items,
			initialNextPageToken: youtubeVideos.nextPageToken,
			initialOwnedVideos,
		},
		revalidate: 86400,
	};
};
