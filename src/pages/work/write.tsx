import { fetchData } from '@/libs/client/utils';
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

interface SearchResult {
	vimeo: VimeoVideos[];
	youtube: GapiItem[];
}

export interface OwnedVideoItems {
	title: string;
	category: VideosCategory;
	date: string;
	description: string;
	resourceId: string;
}

interface OwnedVideos {
	filmShort: OwnedVideoItems[];
	outsource: OwnedVideoItems[];
}

export type ResourceHost = 'vimeo' | 'youtube';

export type FlatformsCategory = 'filmShort' | 'outsource';

interface InitialData {
	initialVimeoVideos: VimeoVideos[];
	initialYoutubeVideos: GapiItem[];
	initialOwnedVideos: OwnedVideos;
}

export default function Write({
	initialVimeoVideos,
	initialYoutubeVideos,
	initialOwnedVideos,
}: InitialData) {
	const router = useRouter();
	const topElement = useRef<HTMLDivElement>(null);
	const [category, setCategory] = useState<'filmShort' | 'outsource'>(
		'filmShort'
	);
	const [searchWord, setSearchWord] = useState('');
	const [searchWordSnapshot, setSearchWordSnapshot] = useState<{
		searchWord: string;
		category: FlatformsCategory;
	}>({ searchWord: '', category: 'filmShort' });
	const [searchResult, setSearchResult] = useState<SearchResult>({
		vimeo: initialVimeoVideos,
		youtube: initialYoutubeVideos,
	});
	const [youtubeVideos, setYoutubeVideos] =
		useState<GapiItem[]>(initialYoutubeVideos);
	const [vimeoVideos, setVimeoVideos] =
		useState<VimeoVideos[]>(initialVimeoVideos);
	const [sendList, { loading, data }] = useMutation<{ success: boolean }>(
		`/api/work/write`
	);
	const [workInfos, setWorkInfos] = useState<WorkInfos[]>();
	const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(true);
	const [isScrollLoading, setIsScrollLoading] = useState(false);
	const ownedVideos: OwnedVideos = initialOwnedVideos;
	const intersectionRef = useInfiniteScrollFromFlatform({
		setVimeoVideos,
		setYoutubeVideos,
		setIsScrollLoading,
		category,
		isInfiniteScrollEnabled,
	});

	useEffect(() => {
		if (category === 'filmShort' && youtubeVideos.length > 0) {
			if (searchWordSnapshot.category !== category) {
				setSearchResult((p) => ({ ...p, vimeo: vimeoVideos }));
				setSearchWordSnapshot((p) => ({ ...p, searchWord: '' }));
				setSearchWord('');
			} else {
				setSearchResult((p) => ({
					...p,
					vimeo: vimeoVideos.filter(
						(el) =>
							el.name.includes(searchWord) ||
							el.resource_key.toLowerCase().includes(searchWord.toLowerCase())
					),
				}));
			}
		} else if (category === 'outsource') {
			if (searchWordSnapshot.category !== category) {
				setSearchResult((p) => ({ ...p, youtube: youtubeVideos }));
				setSearchWordSnapshot((p) => ({ ...p, searchWord: '' }));
				setSearchWord('');
			} else {
				setSearchResult((p) => ({
					...p,
					youtube: youtubeVideos.filter(
						(el) =>
							el.snippet.title.includes(searchWord) ||
							el.snippet.resourceId?.videoId
								.toLowerCase()
								.includes(searchWord.toLowerCase())
					),
				}));
			}
		}
	}, [category, youtubeVideos, vimeoVideos]);
	useEffect(() => {
		isInfiniteScrollEnabled || setIsInfiniteScrollEnabled(true);
		setWorkInfos([]);
	}, [category]);
	useEffect(() => {
		if (data?.success) router.reload();
	}, [data, router]);
	const inputChange = (e: SyntheticEvent<HTMLInputElement>) => {
		const { value, name, dataset, type } = e.currentTarget;
		const workIdx = workInfos?.findIndex(
			(i) => i.resourceId === dataset.resourceid
		);
		if (workIdx !== undefined && workIdx >= 0) {
			if (name === 'title' && value !== '') {
				setWorkInfos((p) =>
					p
						? p.map((arr) =>
								arr.resourceId === dataset.resourceid
									? { ...arr, title: value }
									: arr
						  )
						: undefined
				);
			} else if (name === 'title' && value === '') {
				setWorkInfos((p) =>
					p
						? p.filter((arr) => arr.resourceId !== dataset.resourceid)
						: undefined
				);
			} else if (name === 'description') {
				setWorkInfos((p) =>
					p
						? p.map((arr) =>
								arr.resourceId === dataset.resourceid
									? { ...arr, description: value }
									: arr
						  )
						: undefined
				);
			} else if (name === 'date') {
				setWorkInfos((p) =>
					p
						? p.map((arr) =>
								arr.resourceId === dataset.resourceid
									? { ...arr, date: value }
									: arr
						  )
						: undefined
				);
			} else if (type === 'radio') {
				setWorkInfos((p) =>
					p
						? p.map((arr) =>
								arr.resourceId === dataset.resourceid
									? { ...arr, category: value }
									: arr
						  )
						: undefined
				);
			}
		} else {
			if (name === 'title') {
				setWorkInfos((p) =>
					p
						? [
								...p,
								{
									resourceId: dataset.resourceid ? dataset.resourceid : '',
									title: value,
									description: '',
									category: category === 'filmShort' ? '' : 'outsource',
									date: '',
									thumbnailLink: dataset.thumbnail ? dataset.thumbnail : '',
								},
						  ]
						: [
								{
									resourceId: dataset.resourceid ? dataset.resourceid : '',
									title: value,
									description: '',
									category: category === 'filmShort' ? '' : 'outsource',
									date: '',
									thumbnailLink: dataset.thumbnail ? dataset.thumbnail : '',
								},
						  ]
				);
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
		isInfiniteScrollEnabled || setIsInfiniteScrollEnabled(true);
		setWorkInfos([]);
		setSearchResult((p) => ({
			...p,
			[category]: category === 'filmShort' ? vimeoVideos : youtubeVideos,
		}));
	};
	const onSearch = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSearchWordSnapshot({ searchWord, category });
		//임시방편 setResult의 infiniteScroll 생각해야함
		if (!searchWord) {
			return router.reload();
		}
		const filterResources = (kind: ResourceHost) => {
			if (kind === 'vimeo') {
				setSearchResult((p) => ({
					...p,
					[kind]: vimeoVideos.filter(
						(el) =>
							el.name.includes(searchWord) ||
							el.resource_key.toLowerCase().includes(searchWord.toLowerCase())
					),
				}));
			} else if (kind === 'youtube') {
				setSearchResult((p) => ({
					...p,
					[kind]: youtubeVideos.filter(
						(el) =>
							el.snippet.title.includes(searchWord) ||
							el.snippet.resourceId?.videoId
								.toLowerCase()
								.includes(searchWord.toLowerCase())
					),
				}));
			}
		};
		if (category === 'filmShort') {
			filterResources('vimeo');
		} else if (category === 'outsource') {
			filterResources('youtube');
		}
		isInfiniteScrollEnabled || setIsInfiniteScrollEnabled(true);
	};
	const onUpdatedListClick = () => {
		setIsInfiniteScrollEnabled(false);
		if (!workInfos || workInfos?.length < 1) return;
		if (category === 'filmShort') {
			setSearchResult((p) => ({
				...p,
				vimeo: vimeoVideos.filter((info) =>
					workInfos?.some((video) => video.resourceId === info.player_embed_url)
				),
			}));
		} else if (category === 'outsource') {
			setSearchResult((p) => ({
				...p,
				youtube: youtubeVideos.filter((info) =>
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
						setWorkInfos(undefined);
					}}
					onOutsourceClick={() => {
						setCategory('outsource');
						setWorkInfos(undefined);
					}}
				/>
				<SearchForm
					onSearch={onSearch}
					searchWord={searchWord}
					setSearchWord={setSearchWord}
				/>
				{category === 'filmShort' && vimeoVideos.length > 0 ? (
					<VimeoThumbnailFeed
						inputChange={inputChange}
						resource={searchResult.vimeo}
						workInfos={workInfos}
						intersectionRef={intersectionRef}
						isScrollLoading={isScrollLoading}
						OwnedVideos={ownedVideos.filmShort}
					></VimeoThumbnailFeed>
				) : null}
				{category === 'outsource' ? (
					<YoutubeThumbnailFeed
						inputChange={inputChange}
						resource={searchResult.youtube}
						workInfos={workInfos}
						intersectionRef={intersectionRef}
						isScrollLoading={isScrollLoading}
						OwnedVideos={ownedVideos.outsource}
					></YoutubeThumbnailFeed>
				) : null}
				<SelectedListButton
					onClick={onUpdatedListClick}
					count={workInfos ? workInfos?.length : 0}
					isMobile={true}
				/>
				<ButtonsController
					onReset={onReset}
					onSave={onSubmitWrites}
					onSort={onUpdatedListClick}
					count={workInfos ? workInfos?.length : 0}
				/>
			</section>
			<ToTop toScroll={topElement} />
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
