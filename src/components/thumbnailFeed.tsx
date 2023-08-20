import { GapiItem } from '@/pages/work';
import Image from 'next/image';
import Input from './input';
import { MutableRefObject, SyntheticEvent } from 'react';
import { WorkInfos, VimeoVideos, OwnedVideoItems } from '@/pages/work/write';
import Circles from './circles';

interface videoFeedItem {
	inputChange: (e: SyntheticEvent<HTMLInputElement>) => void;
	isScrollLoading: boolean;
	workInfos: WorkInfos[] | undefined;
	intersectionRef: MutableRefObject<HTMLDivElement | null>;
	OwnedVideos: OwnedVideoItems[];
}

interface YoutubefeedProps extends videoFeedItem {
	resource: GapiItem[];
}

interface VimeofeedProps extends videoFeedItem {
	resource: VimeoVideos[];
}

export function VimeoThumbnailFeed({
	resource,
	inputChange,
	workInfos,
	intersectionRef,
	isScrollLoading,
	OwnedVideos,
}: VimeofeedProps) {
	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12'>
				{resource.map((video, arr) => (
					<div
						key={arr} /* video.resource_key */
						className={`w-full flex flex-col justify-between ${
							workInfos?.find(
								(workInfo) => workInfo.resourceId === video.player_embed_url
							)?.title
								? 'ring-2 ring-palettered'
								: OwnedVideos.find(
										(OwnedVideo) =>
											OwnedVideo.resourceId === video.player_embed_url
								  )
								? 'ring-2 ring-green-500'
								: ''
						}`}
					>
						<div>
							<Image
								src={video.pictures.sizes[3].link}
								alt='picturesAlter'
								width={960}
								height={540}
								priority={arr < 6 ? true : false}
							/>
							<div className='mt-2'>
								<div className='text-sm text-[#bababa] '>
									Title : {video.name}
								</div>
								<div className='text-xs font-light text-[#bababa] break-words'>
									<span className='whitespace-nowrap'>Id : </span>
									{video.resource_key}
								</div>
							</div>
						</div>
						<div className='mt-2'>
							<Input
								name='title'
								type='text'
								placeholder='타이틀'
								data-resourceid={video.player_embed_url}
								data-thumbnail={video.pictures.sizes[4].link}
								onChange={inputChange}
								value={
									workInfos?.find(
										(workInfo) => workInfo.resourceId === video.player_embed_url
									)?.title ||
									OwnedVideos.find(
										(OwnedVideo) =>
											OwnedVideo.resourceId === video.player_embed_url
									)?.title ||
									''
								}
							/>
							<Input
								name='description'
								type='text'
								placeholder='직무'
								data-resourceid={video.player_embed_url}
								onChange={inputChange}
								value={
									workInfos?.find((arr) => {
										return arr.resourceId === video.player_embed_url;
									})?.description ||
									OwnedVideos.find(
										(OwnedVideo) =>
											OwnedVideo.resourceId === video.player_embed_url
									)?.description ||
									''
								}
							/>
							<Input
								name='date'
								type='text'
								placeholder='날짜'
								data-resourceid={video.player_embed_url}
								onChange={inputChange}
								value={
									workInfos?.find((arr) => {
										return arr.resourceId === video.player_embed_url;
									})?.date ||
									OwnedVideos.find(
										(OwnedVideo) =>
											OwnedVideo.resourceId === video.player_embed_url
									)?.date ||
									''
								}
							/>
							<Input
								name={`${video.resource_key}`}
								type='radio'
								labelName='Film'
								value='film'
								data-resourceid={video.player_embed_url}
								onClick={inputChange}
								checked={
									workInfos?.find(
										(info) => info.resourceId === video.player_embed_url
									)
										? workInfos?.find(
												(info) => info.resourceId === video.player_embed_url
										  )?.category === 'film'
											? true
											: false
										: OwnedVideos.find(
												(OwnedVideos) =>
													OwnedVideos.resourceId === video.player_embed_url
										  )?.category === 'film'
										? true
										: false
								}
								radioDisabled={
									workInfos?.find(
										(info) => info.resourceId === video.player_embed_url
									)?.title
										? false
										: true
								}
							/>
							<Input
								name={`${video.resource_key}`}
								type='radio'
								labelName='Short'
								value='short'
								data-resourceid={video.player_embed_url}
								onClick={inputChange}
								checked={
									workInfos?.find(
										(info) => info.resourceId === video.player_embed_url
									)
										? workInfos?.find(
												(info) => info.resourceId === video.player_embed_url
										  )?.category === 'short'
											? true
											: false
										: OwnedVideos.find(
												(OwnedVideos) =>
													OwnedVideos.resourceId === video.player_embed_url
										  )?.category === 'short'
										? true
										: false
								}
								radioDisabled={
									workInfos?.find(
										(info) => info.resourceId === video.player_embed_url
									)?.title
										? false
										: true
								}
							/>
						</div>
					</div>
				))}
			</div>
			<div ref={intersectionRef} className='h-32 my-10 order-last'>
				{isScrollLoading ? (
					<div className='relative w-full h-full flex justify-center items-center'>
						<div className='animate-spin-middle contrast-50 absolute w-[40px] aspect-square'>
							<Circles
								liMotion={{
									css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
								}}
							/>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}

export function YoutubeThumbnailFeed({
	resource,
	inputChange,
	workInfos,
	intersectionRef,
	isScrollLoading,
	OwnedVideos,
}: YoutubefeedProps) {
	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
				{resource.map((data, arr) => (
					<div
						key={arr}
						className={`w-full flex flex-col justify-between ${
							workInfos?.find(
								(info) => info.resourceId === data.snippet.resourceId?.videoId
							)?.title
								? 'ring-2 ring-palettered'
								: OwnedVideos.find(
										(OwnedVideo) =>
											OwnedVideo.resourceId === data.snippet.resourceId?.videoId
								  )
								? 'ring-2 ring-green-500'
								: ''
						}`}
					>
						<div>
							<Image
								src={
									resource.length !== 0
										? data.snippet.thumbnails.maxres?.url ||
										  data.snippet.thumbnails.medium?.url
										: ''
								}
								alt='Thumbnail not available'
								width={1280}
								height={720}
								priority={arr < 6 ? true : false}
								className='w-full object-cover'
							/>
							<div className='mt-2'>
								<div className='text-sm text-[#bababa]'>
									Title : {data.snippet.title}
								</div>
								<div className='text-xs font-light text-[#bababa]'>
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
									data.snippet.resourceId
										? data.snippet.resourceId?.videoId
										: ''
								}
								data-thumbnail={'no-link'}
								onChange={inputChange}
								value={
									workInfos?.find(
										(workInfo) =>
											workInfo.resourceId === data.snippet.resourceId?.videoId
									)?.title ||
									OwnedVideos.find(
										(OwnedVideo) =>
											OwnedVideo.resourceId === data.snippet.resourceId?.videoId
									)?.title ||
									''
								}
							/>
							<Input
								name='description'
								type='text'
								placeholder='직무'
								data-resourceid={
									data.snippet.resourceId
										? data.snippet.resourceId?.videoId
										: ''
								}
								onChange={inputChange}
								value={
									workInfos?.find(
										(workInfo) =>
											workInfo.resourceId === data.snippet.resourceId?.videoId
									)?.description ||
									OwnedVideos.find(
										(OwnedVideo) =>
											OwnedVideo.resourceId === data.snippet.resourceId?.videoId
									)?.description ||
									''
								}
							/>
							<Input
								name='date'
								type='text'
								placeholder='날짜'
								data-resourceid={
									data.snippet.resourceId
										? data.snippet.resourceId?.videoId
										: ''
								}
								onChange={inputChange}
								value={
									workInfos?.find(
										(workInfo) =>
											workInfo.resourceId === data.snippet.resourceId?.videoId
									)?.date ||
									OwnedVideos.find(
										(OwnedVideo) =>
											OwnedVideo.resourceId === data.snippet.resourceId?.videoId
									)?.date ||
									''
								}
							/>
						</div>
					</div>
				))}
			</div>
			<div ref={intersectionRef} className='h-32 my-10 order-last'>
				{isScrollLoading ? (
					<div className='relative w-full h-full flex justify-center items-center'>
						<div className='animate-spin-middle contrast-50 absolute w-[40px] aspect-square'>
							<Circles
								liMotion={{
									css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
								}}
							/>
						</div>
					</div>
				) : null}
			</div>
		</>
	);
}
