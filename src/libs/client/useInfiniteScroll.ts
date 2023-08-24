// import { Stream } from '@prisma/client';
import { FlatformsCategory, VimeoVideos } from '@/pages/work/write';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { GapiItem } from '@/pages/work';
import { VideoCollection } from '@/pages/work/delete';
import { ciIncludes } from './utils';

interface UseInfiniteScrollFromFlatFormProps {
	setList: Dispatch<SetStateAction<VideoCollection<VimeoVideos[], GapiItem[]>>>;
	setFetchLoading: Dispatch<SetStateAction<boolean>>;
	category: FlatformsCategory;
	onSelectedList: boolean;
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	snapshot: string;
	searchResultsCount: number;
	setSearchResults: Dispatch<
		SetStateAction<VideoCollection<VimeoVideos[], GapiItem[]>>
	>;
}

interface apiPage {
	filmShort: number;
	outsource: number;
}

export default function useInfiniteScrollFromFlatform({
	setList,
	setSearchResults,
	setFetchLoading,
	category,
	onSelectedList,
	page,
	setPage,
	snapshot,
	searchResultsCount,
}: UseInfiniteScrollFromFlatFormProps) {
	const lists = {
		outsource: 'PL3Sx9O__-BGnKsABX4khAMW6BBFF_Hf40',
		participate: 'PL3Sx9O__-BGlyWzd0DnpZT9suTNy4kBW1',
	};
	const [nextpageToken, setNextpageToken] = useState<{
		outsource: string;
		participate: string;
	}>({ outsource: 'EAAaBlBUOkNBbw', participate: 'EAAaBlBUOkNBbw' });
	const intersectionRef = useRef<HTMLDivElement | null>(null);
	const [apiPage, setApiPage] = useState<apiPage>({
		filmShort: 2,
		outsource: 2,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [firstIdPerPage, setFirstIdPerPage] = useState(6);
	const [secondIdPerPage, setSecondIdPerPage] = useState(6);

	useEffect(() => {
		setFetchLoading(isLoading);
	}, [isLoading, setFetchLoading]);

	useEffect(() => {
		setFirstIdPerPage(6), setSecondIdPerPage(6);
	}, [category]);

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
				const data = await (
					await fetch(
						`https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.sizes.link,name,description&page=${apiPage[category]}&per_page=12`,
						{
							method: 'get',
							headers: {
								'Content-Type': 'application/json',
								Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
							},
						}
					)
				).json();

				setList((p) => ({
					...p,
					[category]: [...p[category], ...data.data],
				}));

				setSearchResults((p) => ({
					...p,
					[category]: [
						...p[category],
						...data.data.filter(
							(el: VimeoVideos) =>
								ciIncludes(el.name, snapshot) ||
								ciIncludes(el.resource_key, snapshot)
						),
					],
				}));

				if (data.data.length === 12) {
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
				if (nextpageToken.outsource !== '') {
					const data = await (
						await fetch(
							`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&pageToken=${nextpageToken.outsource}&part=snippet&playlistId=${lists.outsource}&maxResults=${firstIdPerPage}&fields=(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)`,
							{
								method: 'get',
								headers: {
									'Content-Type': 'application/json',
								},
							}
						)
					).json();

					setList((p) => ({
						...p,
						[category]: [...p[category], ...data.items],
					}));

					setSearchResults((p) => ({
						...p,
						[category]: [
							...p[category],
							...data.items.filter(
								(item: GapiItem) =>
									ciIncludes(item.snippet.title, snapshot) ||
									ciIncludes(item.snippet.resourceId?.videoId || '', snapshot)
							),
						],
					}));

					if (data.items.length < 6) {
						setFirstIdPerPage(12);
					}

					if (data.nextPageToken) {
						setNextpageToken((p) => ({
							...p,
							outsource: data.nextPageToken,
						}));
					} else {
						setNextpageToken((p) => ({ ...p, outsource: '' }));
					}
				}

				if (nextpageToken.participate !== '') {
					const data = await (
						await fetch(
							`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&pageToken=${nextpageToken.participate}&part=snippet&playlistId=${lists.participate}&maxResults=${secondIdPerPage}&fields=(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)`,
							{
								method: 'get',
								headers: {
									'Content-Type': 'application/json',
								},
							}
						)
					).json();

					setList((p) => ({
						...p,
						[category]: [...p[category], ...data.items],
					}));

					setSearchResults((p) => ({
						...p,
						[category]: [
							...p[category],
							...data.items.filter(
								(item: GapiItem) =>
									ciIncludes(item.snippet.title, snapshot) ||
									ciIncludes(item.snippet.resourceId?.videoId || '', snapshot)
							),
						],
					}));

					if (data.items.length < 6) {
						setSecondIdPerPage(12);
					}

					if (data.nextPageToken) {
						setNextpageToken((p) => ({
							...p,
							participate: data.nextPageToken,
						}));
					} else {
						setNextpageToken((p) => ({ ...p, participate: '' }));
					}
				}

				if (
					(nextpageToken.outsource !== '' ||
						nextpageToken.participate !== '') &&
					apiPage[category] === page
				) {
					setApiPage((p) => ({ ...p, [category]: p[category] + 1 }));
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
		nextpageToken.outsource,
		nextpageToken.participate,
		onSelectedList,
		category,
		snapshot,
		page,
		searchResultsCount,
		firstIdPerPage,
		secondIdPerPage,
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
