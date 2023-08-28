// import { Stream } from '@prisma/client';
import { FlatformsCategory, VimeoVideos } from '@/pages/work/write';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { GapiItem } from '@/pages/work';
import { VideoCollection } from '@/pages/work/delete';
import { ciIncludes, fetchData } from './utils';

interface UseInfiniteScrollFromFlatFormProps {
	category: FlatformsCategory;
	onSelectedList: boolean;
	page: number;
	snapshot: string;
	searchResultsCount: number;
	initialNextPageToken: string;
	setSearchResults: Dispatch<
		SetStateAction<VideoCollection<VimeoVideos[], GapiItem[]>>
	>;
	setPage: Dispatch<SetStateAction<number>>;
	setList: Dispatch<SetStateAction<VideoCollection<VimeoVideos[], GapiItem[]>>>;
	setFetchLoading: Dispatch<SetStateAction<boolean>>;
}

interface ApiPage {
	filmShort: number;
	outsource: number;
}

export interface ExtendGapiItems {
	id: string;
	snippet: {
		description: string;
		thumbnails: {
			[key: string]: { url: string; width: number; height: number };
		};
		title: string;
		resourceId?: { videoId: string };
	};
	animated_thumbnail: string;
}

export default function useInfiniteScrollFromFlatform({
	setList,
	setSearchResults,
	setFetchLoading,
	setPage,
	category,
	onSelectedList,
	page,
	snapshot,
	searchResultsCount,
	initialNextPageToken,
}: UseInfiniteScrollFromFlatFormProps) {
	const youtubePlaylistId = 'PL3Sx9O__-BGlt-FYFXIO15RbxFwegMs8C';
	const [nextPageToken, setNextPageToken] =
		useState<string>(initialNextPageToken);
	const intersectionRef = useRef<HTMLDivElement | null>(null);
	const [apiPage, setApiPage] = useState<ApiPage>({
		filmShort: 2,
		outsource: 2,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState(true);
	const perPage = 12;

	useEffect(() => {
		setFetchLoading(isLoading);
	}, [isLoading, setFetchLoading]);

	const addData = async () => {
		if (isLoading) return;
		setIsLoading(true);

		try {
			if (
				category === 'filmShort' &&
				!onSelectedList &&
				apiPage[category] <= page &&
				hasNextPage
			) {
				const mergedVimeoVideos: VimeoVideos[] = await Promise.all(
					(
						await fetchData(
							`https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.base_link,name,description&page=${apiPage[category]}&per_page=12`,
							{
								headers: {
									'Content-Type': 'application/json',
									Authorization:
										process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
								},
							}
						)
					).data.map(async (el: VimeoVideos) => {
						const data = (
							await fetchData(
								`https://api.vimeo.com${el.uri}/animated_thumbsets?fields=sizes.link,sizes.profile_id`,
								{
									headers: {
										'Content-Type': 'application/json',
										Authorization:
											process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
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

				setList((p) => ({
					...p,
					[category]: [...p[category], ...mergedVimeoVideos],
				}));

				setSearchResults((p) => ({
					...p,
					[category]: [
						...p[category],
						...mergedVimeoVideos.filter((el: VimeoVideos) =>
							ciIncludes(el.name, snapshot)
						),
					],
				}));

				if (mergedVimeoVideos.length === 12) {
					setApiPage((p) => ({ ...p, [category]: p[category] + 1 }));
				} else {
					setHasNextPage(false);
				}
			} else if (
				category === 'outsource' &&
				!onSelectedList &&
				apiPage[category] <= page
			) {
				const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
				if (nextPageToken !== '') {
					const youtubeData: { nextPageToken: string; items: GapiItem[] } =
						await (
							await fetch(
								`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${youtubePlaylistId}&pageToken=${nextPageToken}&maxResults=${perPage}&part=snippet&fields=(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)`,
								{
									method: 'get',
									headers: {
										'Content-Type': 'application/json',
									},
								}
							)
						).json();

					const mergedYoutubeData: ExtendGapiItems[] = youtubeData.items.map(
						(item: GapiItem) => ({
							...item,
							animated_thumbnail: 'no-link',
						})
					);

					setList((p) => ({
						...p,
						[category]: [...p[category], ...mergedYoutubeData],
					}));

					setSearchResults((p) => ({
						...p,
						[category]: [
							...p[category],
							...mergedYoutubeData.filter((item: ExtendGapiItems) =>
								ciIncludes(item.snippet.title, snapshot)
							),
						],
					}));

					if (youtubeData.nextPageToken) {
						setNextPageToken(youtubeData.nextPageToken);
						setApiPage((p) => ({ ...p, [category]: p[category] + 1 }));
					} else {
						setNextPageToken('');
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
		if (page - 11 / 12 <= searchResultsCount / 12 + 1) {
			setPage((p) => p + 1);
		}
		setIsLoading(false);
	};

	const handleIntersection: IntersectionObserverCallback = (entries) => {
		const entry = entries[0];
		if (entry.isIntersecting && !onSelectedList) {
			addData();
		}
	};

	useEffect(() => {
		const options: IntersectionObserverInit = {
			root: null,
			rootMargin: '0px',
			threshold: 0.5,
		};
		const observer = new IntersectionObserver(handleIntersection, options);
		const currentIntersectionRef = intersectionRef.current;
		if (currentIntersectionRef) {
			observer.observe(currentIntersectionRef);
		} else {
			console.log('Observe Failed');
		}
		return () => {
			if (currentIntersectionRef) {
				observer.unobserve(currentIntersectionRef);
			}
		};
	}, [
		apiPage,
		hasNextPage,
		onSelectedList,
		category,
		snapshot,
		page,
		searchResultsCount,
	]);
	return intersectionRef;
}

interface ObserverHandlerConfig {
	root?: Element | Document | null | undefined;
	rootMargin?: string | undefined;
	threshold?: number | number[] | undefined;
}

interface UseInfiniteScroll<T> {
	processIntersection: () => void;
	observerHandlerConfig?: ObserverHandlerConfig;
	dependencyArray?: T[];
}

export function useInfiniteScroll<T = unknown>({
	processIntersection,
	observerHandlerConfig = { root: null, rootMargin: '0px', threshold: 0.5 },
	dependencyArray = [],
}: UseInfiniteScroll<T>) {
	const intersectionRef = useRef<HTMLDivElement>(null);
	const dependency = [...dependencyArray];
	const handleIntersection = (entries: IntersectionObserverEntry[]) => {
		const entry = entries[0];
		if (entry.isIntersecting) {
			processIntersection();
		}
	};
	useEffect(() => {
		const observer = new IntersectionObserver(
			handleIntersection,
			observerHandlerConfig
		);
		const currentIntersectionRef = intersectionRef.current;
		if (currentIntersectionRef) {
			observer.observe(currentIntersectionRef);
		}
		return () => {
			if (currentIntersectionRef) {
				observer.unobserve(currentIntersectionRef);
			}
		};
	}, [observerHandlerConfig, dependency]);
	return intersectionRef;
}
