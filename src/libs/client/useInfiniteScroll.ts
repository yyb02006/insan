// import { Stream } from '@prisma/client';
import { FlatformsCategory, VimeoVideos } from '@/pages/work/write';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { GapiItem } from '@/pages/work';

type SetVimeoFunc = (value: SetStateAction<VimeoVideos[]>) => void;

type SetYoutubeFunc = (value: SetStateAction<GapiItem[]>) => void;

interface UseInfiniteScrollFromFlatFormProps {
	setVimeoVideos: SetVimeoFunc;
	setYoutubeVideos: SetYoutubeFunc;
	setIsScrollLoading: Dispatch<SetStateAction<boolean>>;
	category: FlatformsCategory;
	isInfiniteScrollEnabled: boolean;
}

export default function useInfiniteScrollFromFlatform({
	setVimeoVideos,
	setYoutubeVideos,
	setIsScrollLoading,
	category,
	isInfiniteScrollEnabled,
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
	const [page, setPage] = useState<number>(2);
	const [isLoading, setIsLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState(true);
	const [firstIdPerPage, setFirstIdPerPage] = useState(6);
	const [secondIdPerPage, setSecondIdPerPage] = useState(6);
	useEffect(() => {
		setIsScrollLoading(isLoading);
	}, [isLoading, setIsScrollLoading]);
	useEffect(() => {
		setFirstIdPerPage(6), setSecondIdPerPage(6);
	}, [category]);
	const addData = async () => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			if (category === 'filmShort') {
				if (hasNextPage) {
					const data = await (
						await fetch(
							`https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.sizes.link,name,description&page=${page}&per_page=12`,
							{
								method: 'get',
								headers: {
									'Content-Type': 'application/json',
									Authorization:
										process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
								},
							}
						)
					).json();
					setVimeoVideos((p) => [...p, ...data.data]);
					if (data.data.length === 12) {
						setPage((p) => p + 1);
					} else {
						setHasNextPage(false);
					}
				}
			} else if (category === 'outsource') {
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

					setYoutubeVideos((p) => [...p, ...data.items]);

					if (data.items.length < 6) {
						setSecondIdPerPage(12 - data.items.length);
					} else if (data.items.length < 12 && data.items.length > 6) {
						setFirstIdPerPage(12);
					}

					if (data.nextPageToken) {
						setNextpageToken((p) => ({ ...p, outsource: data.nextPageToken }));
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

					setYoutubeVideos((p) => [...p, ...data.items]);

					if (data.items.length < 6) {
						setFirstIdPerPage(12 - data.items.length);
					} else if (data.items.length < 12 && data.items.length > 6) {
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
			}
		} catch (err) {
			console.log(err);
		}
		setIsLoading(false);
	};

	const handleIntersection: IntersectionObserverCallback = (entries) => {
		const entry = entries[0];
		if (entry.isIntersecting) {
			addData();
		}
	};

	useEffect(() => {
		if (!isInfiniteScrollEnabled) return;
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
		page,
		hasNextPage,
		nextpageToken.outsource,
		nextpageToken.participate,
		isInfiniteScrollEnabled,
		category,
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
