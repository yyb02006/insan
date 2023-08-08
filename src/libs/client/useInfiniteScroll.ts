// import { Stream } from '@prisma/client';
import { VimeoVideos } from '@/pages/work/write';
import {
	MutableRefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import { fetchYouTubeApi } from './utils';
import { GapiItem } from '@/pages/work';

type SetVimeoFunc = (value: SetStateAction<VimeoVideos[]>) => void;

type SetYoutubeFunc = (value: SetStateAction<GapiItem[]>) => void;

interface test {
	setVimeoVideos: SetVimeoFunc;
	setYoutubeVideos: SetYoutubeFunc;
	category: 'film&short' | 'outsource';
}

export default function useInfiniteScrollTest({
	setVimeoVideos,
	setYoutubeVideos,
	category,
}: test) {
	const lists = [
		{ title: '외주 작업', id: 'PL3Sx9O__-BGnKsABX4khAMW6BBFF_Hf40' },
		{ title: '참여 촬영', id: 'PL3Sx9O__-BGlyWzd0DnpZT9suTNy4kBW1' },
	];
	const [nextpageTokenInit, setNextpageTokenInit] = useState<{
		outsource: string;
		paticipate: string;
	}>({ outsource: 'EAAaBlBUOkNBbw', paticipate: 'EAAaBlBUOkNBbw' });
	const intersectionRef = useRef<HTMLDivElement | null>(null);
	const [page, setPage] = useState<number>(2);
	const [isLoading, setIsLoading] = useState(false);
	const [hasNextPage, setHasNextPage] = useState(true);
	const addData = async () => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			if (category === 'film&short') {
				const data = await (
					await fetch(
						`https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.sizes.link,name,description&page=${page}&per_page=10`,
						{
							method: 'get',
							headers: {
								'Content-Type': 'application/json',
								Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
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
			} else if (category === 'outsource') {
				lists.forEach((list) => {
					fetchYouTubeApi(
						'playlistItems',
						'10',
						(data: { items: GapiItem[]; nextPageToken: string }) => {
							if (
								list.title === '외주 작업' &&
								data.nextPageToken !== nextpageTokenInit.outsource
							) {
								setYoutubeVideos((p) => [...p, ...data.items]);
								setNextpageTokenInit((p) => ({
									...p,
									outsource: data.nextPageToken,
								}));
								console.log(
									'dfafdfgghhhhhhhhhhh' + data.nextPageToken,
									nextpageTokenInit.outsource
								);
							} else if (
								list.title === '참여 촬영' &&
								data.nextPageToken !== nextpageTokenInit.paticipate
							) {
								setYoutubeVideos((p) => [...p, ...data.items]);
								setNextpageTokenInit((p) => ({
									...p,
									paticipate: data.nextPageToken,
								}));
							}
						},
						'(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)',
						list.id,
						undefined,
						list.title === '외주 작업'
							? nextpageTokenInit.outsource
							: nextpageTokenInit.paticipate
					);
				});
			}
		} catch (err) {
			console.log(err);
		}
		setIsLoading(false);
	};

	const observerCallback: IntersectionObserverCallback = (entries) => {
		const entry = entries[0];
		if (entry.isIntersecting && hasNextPage) {
			console.log('intersecting' + page);
			addData();
		}
	};
	useEffect(() => {
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
		nextpageTokenInit.outsource,
		nextpageTokenInit.paticipate,
	]);
	return intersectionRef;
}
