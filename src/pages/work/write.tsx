import { fetchYouTubeApi } from '@/libs/client/utils';
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

export default function Write() {
	const router = useRouter();
	const topElement = useRef<HTMLDivElement>(null);
	const [category, setCategory] = useState<'filmShort' | 'outsource'>(
		'filmShort'
	);
	const lists = [
		{ title: '외주 작업', id: 'PL3Sx9O__-BGnKsABX4khAMW6BBFF_Hf40' },
		{ title: '참여 촬영', id: 'PL3Sx9O__-BGlyWzd0DnpZT9suTNy4kBW1' },
	];
	const [searchWord, setSearchWord] = useState('');
	const [searchWordSnapshot, setSearchWordSnapshot] = useState<{
		searchWord: string;
		category: FlatformsCategory;
	}>({ searchWord: '', category: 'filmShort' });
	const [searchResult, setSearchResult] = useState<SearchResult>({
		vimeo: [],
		youtube: [],
	});
	const [youtubeVideos, setYoutubeVideos] = useState<GapiItem[]>([]);
	const [vimeoVideos, setVimeoVideos] = useState<VimeoVideos[]>([]);
	const [sendList, { loading, data }] = useMutation<{ success: boolean }>(
		'/api/work/write'
	);
	const [workInfos, setWorkInfos] = useState<WorkInfos[]>();
	const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(true);
	const [isScrollLoading, setIsScrollLoading] = useState(false);
	const [ownedVideos, setOwnedVideos] = useState<OwnedVideos>({
		filmShort: [],
		outsource: [],
	});
	const intersectionRef = useInfiniteScrollFromFlatform({
		setVimeoVideos,
		setYoutubeVideos,
		setIsScrollLoading,
		category,
		isInfiniteScrollEnabled,
	});
	useEffect(() => {
		fetch(
			`https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.sizes.link,name,description&page=1&per_page=10`,
			{
				method: 'get',
				headers: {
					'Content-Type': 'application/json',
					Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
				},
			}
		)
			.then((res) => res.json())
			.then((data) => {
				setVimeoVideos((p) => [...p, ...data.data]);
				setSearchResult((p) => ({ ...p, vimeo: [...data.data] }));
				// console.log(data.data);
			});
		lists.forEach((list) => {
			fetchYouTubeApi(
				'playlistItems',
				'10',
				(data: { items: GapiItem[]; nextPageToken: string }) => {
					setYoutubeVideos((p) => [...p, ...data.items]);
					setSearchResult((p) => ({ ...p, youtube: [...data.items] }));
				},
				'(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)',
				list.id
			);
		});
		const getVideoListAPI = async () => {
			const videos = await (await fetch('/api/work/list?from=write')).json();
			setOwnedVideos(videos.work);
		};
		getVideoListAPI();
	}, []);
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
		setWorkInfos(undefined);
	}, [category, isInfiniteScrollEnabled]);
	useEffect(() => {
		console.log(data?.success);
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
		sendList(workInfos);
	};
	const onReset = () => {
		setWorkInfos([]);
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
	console.log(workInfos);
	console.log(loading);

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
		</Layout>
	);
}
