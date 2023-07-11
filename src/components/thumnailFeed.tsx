import { GapiItem } from '@/pages/work';
import Image from 'next/image';
import Input from './input';
import { SetStateAction, SyntheticEvent } from 'react';
import { WorkInfos, VimeoVideos } from '@/pages/work/write';

interface YoutubefeedProps {
	resource: GapiItem[];
	inputChange: (e: SyntheticEvent<HTMLInputElement>) => void;
	workInfos: WorkInfos[] | undefined;
}

interface VimeofeedProps {
	resource: VimeoVideos[];
	inputChange: (e: SyntheticEvent<HTMLInputElement>) => void;
	workInfos: WorkInfos[] | undefined;
}

export function VimeoThumnailFeed({
	resource,
	inputChange,
	workInfos,
}: VimeofeedProps) {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
			{resource.map((video, arr) => (
				<div
					key={arr} /* video.resource_key */
					className='relative w-auto aspect-video'
				>
					<div>
						<Image
							src={video.pictures.sizes[4].link}
							alt='picturesAlter'
							width={960}
							height={540}
							priority
						></Image>
						<div className='mt-2'>
							<div className='text-sm'>Title : {video.name}</div>
							<div className='text-xs font-light'>
								Id : {video.resource_key}
							</div>
						</div>
					</div>
					<div className='mt-2'>
						<Input
							name='title'
							type='text'
							placeholder='타이틀'
							data-resourceid={video.player_embed_url}
							onChange={inputChange}
							value={
								workInfos?.find((arr) => {
									return arr.resourceId === video.player_embed_url;
								})?.title
									? workInfos.find((arr) => {
											return arr.resourceId === video.player_embed_url;
									  })?.title
									: ''
							}
						/>
						<Input
							name='description'
							type='text'
							placeholder='설명'
							data-resourceid={video.player_embed_url}
							onChange={inputChange}
							value={
								workInfos?.find((arr) => {
									return arr.resourceId === video.player_embed_url;
								})?.description
									? workInfos.find((arr) => {
											return arr.resourceId === video.player_embed_url;
									  })?.description
									: ''
							}
						/>
					</div>
					{/* <VimeoPlayer
				url={video.player_embed_url}
				controls={true}
				width={'100%'}
				height={'100%'}
			></VimeoPlayer> */}
				</div>
			))}
		</div>
	);
}

export function YoutubeThumnailFeed({
	resource,
	inputChange,
	workInfos,
}: YoutubefeedProps) {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
			{resource.map((data, arr) => (
				<div key={arr} className='w-full flex flex-col justify-between'>
					<div>
						<Image
							src={
								resource.length !== 0
									? data.snippet.thumbnails.maxres?.url ||
									  data.snippet.thumbnails.medium?.url
									: ''
							}
							alt='test'
							width={1280}
							height={720}
							className='w-full object-cover'
						/>
						<div className='mt-2'>
							<div className='text-sm'>Title : {data.snippet.title}</div>
							<div className='text-xs font-light'>
								Id : {data.snippet.resourceId?.videoId}
							</div>
						</div>
					</div>
					<div className='mt-2'>
						<Input
							name='title'
							type='text'
							placeholder='타이틀'
							data-resourceid={
								data.snippet.resourceId ? data.snippet.resourceId?.videoId : ''
							}
							onChange={inputChange}
							value={
								workInfos?.find((arr) => {
									return arr.resourceId === data.snippet.resourceId?.videoId;
								})?.title
									? workInfos.find((arr) => {
											return (
												arr.resourceId === data.snippet.resourceId?.videoId
											);
									  })?.title
									: ''
							}
						/>
						<Input
							name='description'
							type='text'
							placeholder='설명'
							data-resourceid={
								data.snippet.resourceId ? data.snippet.resourceId?.videoId : ''
							}
							onChange={inputChange}
							value={
								workInfos?.find((arr) => {
									return arr.resourceId === data.snippet.resourceId?.videoId;
								})?.description
									? workInfos.find((arr) => {
											return (
												arr.resourceId === data.snippet.resourceId?.videoId
											);
									  })?.description
									: ''
							}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
