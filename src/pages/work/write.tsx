import { cls, fetchYouTubeApi } from '@/libs/client/utils';
import { SyntheticEvent, useEffect, useState } from 'react';
import { GapiItem } from '.';
import Input from '@/components/input';
import useMutation from '@/libs/client/useMutation';
import Layout from '@/components/layout';
import Link from 'next/link';
import {
	VimeoThumbnailFeed,
	YoutubeThumbnailFeed,
} from '@/components/thumbnailFeed';
import Image from 'next/image';
import VimeoPlayer from 'react-player/vimeo';

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

export type ResourceHost = 'vimeo' | 'youtube';

export default function Write() {
	const [category, setCategory] = useState<'film&short' | 'outsource'>(
		'film&short'
	);
	const lists = [
		{ title: '외주 작업', id: 'PL3Sx9O__-BGnKsABX4khAMW6BBFF_Hf40' },
		{ title: '참여 촬영', id: 'PL3Sx9O__-BGlyWzd0DnpZT9suTNy4kBW1' },
	];
	const [searchWord, setSearchWord] = useState('');
	const [searchResult, setSearchResult] = useState<SearchResult>({
		vimeo: [],
		youtube: [],
	});
	const [youtubeVideos, setYoutubeVideos] = useState<GapiItem[]>([]);
	const [vimeoVideos, setVimeoVideos] = useState<VimeoVideos[]>([]);
	const [sendList, { loading }] = useMutation<WorkInfos[]>('/api/work/write');
	const [workInfos, setWorkInfos] = useState<WorkInfos[]>();
	useEffect(() => {
		fetch(
			'https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.sizes.link,name,description',
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
				console.log(data.data);
			});
		lists.forEach((list) => {
			fetchYouTubeApi(
				'playlistItems',
				'10',
				(data: { items: GapiItem[] }) => {
					setYoutubeVideos((p) => [...p, ...data.items]);
					setSearchResult((p) => ({ ...p, youtube: [...data.items] }));
				},
				'(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)))',
				list.id
			);
		});
	}, []);
	useEffect(() => {
		setWorkInfos(undefined);
		if (category === 'film&short' && youtubeVideos.length > 0) {
			setSearchResult((p) => ({ ...p, vimeo: vimeoVideos }));
		} else if (category === 'outsource') {
			setSearchResult((p) => ({ ...p, youtube: youtubeVideos }));
		}
	}, [category]);
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
									category: category === 'film&short' ? '' : 'outsource',
									date: 'no-date',
									thumbnailLink: dataset.thumbnail ? dataset.thumbnail : '',
								},
						  ]
						: [
								{
									resourceId: dataset.resourceid ? dataset.resourceid : '',
									title: value,
									description: '',
									category: category === 'film&short' ? '' : 'outsource',
									date: 'no-date',
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
		if (!searchWord) return;
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
		if (category === 'film&short') {
			filterResources('vimeo');
		} else if (category === 'outsource') {
			filterResources('youtube');
		}
	};
	const onUpdatedListClick = () => {
		if (category === 'film&short') {
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
	console.log(searchResult);
	return (
		<Layout
			seoTitle='Write'
			footerPosition='hidden'
			nav={{ isShort: true }}
			menu={false}
		>
			<section className='relative xl:px-40 sm:px-24 px-16'>
				<div>
					<div className='h-[100px] flex items-center justify-center font-GmarketSans font-bold text-3xl'>
						추가하기
					</div>
					<div className='fixed right-0 top-0 mr-[40px] md:mr-[60px] h-[100px] flex items-center text-sm'>
						<Link href={'/work/delete'}>삭제하기</Link>
					</div>
				</div>
				<div className='flex py-4'>
					<button
						onClick={() => {
							setCategory('film&short');
							setWorkInfos(undefined);
						}}
						className={cls(
							category === 'film&short' ? 'text-palettered' : '',
							'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
						)}
					>
						Film / Short
					</button>
					<button
						onClick={() => {
							setCategory('outsource');
							setWorkInfos(undefined);
						}}
						className={cls(
							category === 'outsource' ? 'text-palettered' : '',
							'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
						)}
					>
						Outsource
					</button>
				</div>
				<form
					onSubmit={onSearch}
					className='relative mb-8 mt-4 font-light flex items-center gap-2 pb-1 border-b border-[#9a9a9a] text-lg leading-tight text-[#eaeaea]'
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
					/>
				</form>
				{category === 'film&short' && vimeoVideos.length > 0 ? (
					<VimeoThumbnailFeed
						inputChange={inputChange}
						resource={searchResult.vimeo}
						workInfos={workInfos}
					></VimeoThumbnailFeed>
				) : null}
				{category === 'outsource' ? (
					<YoutubeThumbnailFeed
						inputChange={inputChange}
						resource={searchResult.youtube}
						workInfos={workInfos}
					></YoutubeThumbnailFeed>
				) : null}
				<div className='sm:w-[60px] flex sm:block h-14 sm:h-auto w-full sm:ring-1 sm:ring-palettered sm:rounded-full fixed xl:right-20 sm:right-4 right-0 sm:top-[100px] sm:bottom-auto bottom-0'>
					<button
						onClick={onReset}
						className='w-full ring-1 ring-palettered aspect-square bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
					>
						Reset
					</button>
					<button
						onClick={onSubmitWrites}
						className='w-full ring-1 ring-palettered aspect-square bg-palettered sm:bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
					>
						Save
					</button>
					<button
						onClick={onUpdatedListClick}
						className='hidden sm:inline-block w-full ring-1 ring-palettered aspect-square sm:rounded-full sm:font-light font bold text-sm sm:hover:text-palettered sm:hover:font-bold'
					>
						<div>{workInfos ? workInfos.length : '0'}</div>
						<div>Lists</div>
					</button>
				</div>
			</section>
		</Layout>
	);
}
