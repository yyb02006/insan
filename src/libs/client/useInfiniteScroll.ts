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
	useEffect(() => {
		setIsScrollLoading(isLoading);
	}, [isLoading]);
	const addData = async () => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			if (category === 'filmShort') {
				if (hasNextPage) {
					const data = await (
						await fetch(
							`https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.sizes.link,name,description&page=${page}&per_page=10`,
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
					if (data.data.length === 10) {
						setPage((p) => (p = p + 1));
					} else {
						setHasNextPage(false);
					}
				}
			} else if (category === 'outsource') {
				const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
				if (nextpageToken.outsource !== '') {
					const data = await (
						await fetch(
							`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&pageToken=${nextpageToken.outsource}&part=snippet&playlistId=${lists.outsource}&maxResults=10&fields=(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)`,
							{
								method: 'get',
								headers: {
									'Content-Type': 'application/json',
								},
							}
						)
					).json();
					if (data.nextPageToken) {
						setNextpageToken((p) => ({ ...p, outsource: data.nextPageToken }));
						setYoutubeVideos((p) => [...p, ...data.items]);
					} else {
						setNextpageToken((p) => ({ ...p, outsource: '' }));
					}
				}
				if (nextpageToken.participate !== '') {
					const data = await (
						await fetch(
							`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&pageToken=${nextpageToken.participate}&part=snippet&playlistId=${lists.participate}&maxResults=10&fields=(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)`,
							{
								method: 'get',
								headers: {
									'Content-Type': 'application/json',
								},
							}
						)
					).json();
					if (data.nextPageToken) {
						setNextpageToken((p) => ({
							...p,
							participate: data.nextPageToken,
						}));
						setYoutubeVideos((p) => [...p, ...data.items]);
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

	const observerCallback: IntersectionObserverCallback = (entries) => {
		const entry = entries[0];
		if (entry.isIntersecting) {
			console.log('intersecting' + page);
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
		const observer = new IntersectionObserver(observerCallback, options);
		if (intersectionRef.current) {
			observer.observe(intersectionRef.current);
			console.log('observe');
		} else {
			console.log('failed');
		}
		return () => {
			if (intersectionRef.current) {
				observer.unobserve(intersectionRef.current);
			}
		};
	}, [
		intersectionRef.current,
		page,
		hasNextPage,
		nextpageToken.outsource,
		nextpageToken.participate,
		isInfiniteScrollEnabled,
	]);
	return intersectionRef;
}

interface ObserverHandlerConfig {
	root?: Element | Document | null | undefined;
	rootMargin?: string | undefined;
	threshold?: number | number[] | undefined;
}

interface UseInfiniteScrollFromDB<T> {
	processIntersection: () => void;
	observerHandlerConfig?: ObserverHandlerConfig;
	dependencyArray?: T[];
}

export function useInfiniteScrollFromDB<T = unknown>({
	processIntersection,
	observerHandlerConfig = { root: null, rootMargin: '0px', threshold: 0.5 },
	dependencyArray = [],
}: UseInfiniteScrollFromDB<T>) {
	const intersectionRef = useRef<HTMLDivElement>(null);
	const handleIntersection = (entries: IntersectionObserverEntry[]) => {
		const [entry] = entries;
		if (entry.isIntersecting) {
			processIntersection();
		}
	};
	useEffect(() => {
		const observer = new IntersectionObserver(
			handleIntersection,
			observerHandlerConfig
		);
		if (intersectionRef.current) {
			observer.observe(intersectionRef.current);
		}
		return () => {
			if (intersectionRef.current) {
				observer.unobserve(intersectionRef.current);
			}
		};
	}, [intersectionRef, ...dependencyArray]);
	return intersectionRef;
}
