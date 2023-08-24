import { GapiItem } from '@/pages/work';
import Image from 'next/image';
import Input from './input';
import { MutableRefObject, SyntheticEvent } from 'react';
import { WorkInfos, VimeoVideos, OwnedVideoItems } from '@/pages/work/write';
import Circles from './circles';

interface videoFeedItem {
	fetchLoading: boolean;
	workInfos: WorkInfos[] | undefined;
	intersectionRef: MutableRefObject<HTMLDivElement | null>;
	ownedVideos: OwnedVideoItems[];
	page: number;
	inputBlur: (e: SyntheticEvent<HTMLInputElement>) => void;
	inputChange: (e: SyntheticEvent<HTMLInputElement>) => void;
}

interface YoutubefeedProps extends videoFeedItem {
	resource: GapiItem[];
}

interface VimeofeedProps extends videoFeedItem {
	resource: VimeoVideos[];
}

export function VimeoThumbnailFeed({
	resource,
	workInfos,
	intersectionRef,
	fetchLoading,
	ownedVideos,
	page,
	inputChange,
	inputBlur,
}: VimeofeedProps) {
	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12'>
				{resource.map((video, idx) => {
					const matchedWorkInfos = workInfos?.find(
						(workInfo) => workInfo.resourceId === video.player_embed_url
					);
					const matchedOwnedVideos = ownedVideos.find(
						(ownedVideo) => ownedVideo.resourceId === video.player_embed_url
					);

					return idx < 12 * (page - 1) ? (
						<div
							key={idx} /* video.resource_key */
							className={`w-full flex flex-col justify-between ${
								matchedWorkInfos
									? 'ring-2 ring-palettered'
									: matchedOwnedVideos
									? 'ring-2 ring-green-500'
									: ''
							}`}
						>
							<div>
								<Image
									src={`${video.pictures.base_link}_640x360?r=pad`}
									alt={`${video.name} thumbnail`}
									width={640}
									height={360}
									priority={idx < 6 ? true : false}
									className='w-full'
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
									//여기 썸네일 변경
									data-thumbnail={video.pictures.base_link}
									data-animated_thumbnail={video.animated_thumbnail}
									data-description={matchedOwnedVideos?.description}
									data-date={matchedOwnedVideos?.date}
									data-category={matchedOwnedVideos?.category}
									onChange={inputChange}
									onBlur={inputBlur}
									value={
										matchedWorkInfos
											? matchedWorkInfos.title
											: matchedOwnedVideos
											? matchedOwnedVideos.title
											: ''
									}
								/>
								<Input
									name='description'
									type='text'
									placeholder='직무'
									data-resourceid={video.player_embed_url}
									onChange={inputChange}
									value={
										matchedWorkInfos
											? matchedWorkInfos.description
											: matchedOwnedVideos
											? matchedOwnedVideos.description
											: ''
									}
								/>
								<Input
									name='date'
									type='text'
									placeholder='날짜'
									data-resourceid={video.player_embed_url}
									onChange={inputChange}
									value={
										matchedWorkInfos
											? matchedWorkInfos.date
											: matchedOwnedVideos
											? matchedOwnedVideos.date
											: ''
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
										matchedWorkInfos
											? matchedWorkInfos.category === 'film'
												? true
												: false
											: matchedOwnedVideos?.category === 'film'
											? true
											: false
									}
									radioDisabled={matchedWorkInfos ? false : true}
								/>
								<Input
									name={`${video.resource_key}`}
									type='radio'
									labelName='Short'
									value='short'
									data-resourceid={video.player_embed_url}
									onClick={inputChange}
									checked={
										matchedWorkInfos
											? matchedWorkInfos.category === 'short'
												? true
												: false
											: matchedOwnedVideos?.category === 'short'
											? true
											: false
									}
									radioDisabled={matchedWorkInfos ? false : true}
								/>
							</div>
						</div>
					) : null;
				})}
			</div>
			<div ref={intersectionRef} className='h-32 my-10 order-last'>
				{fetchLoading ? (
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
	workInfos,
	intersectionRef,
	fetchLoading,
	ownedVideos,
	page,
	inputChange,
	inputBlur,
}: YoutubefeedProps) {
	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
				{resource.map((video, idx) => {
					const matchedWorkInfos = workInfos?.find(
						(workInfo) =>
							workInfo.resourceId === video.snippet.resourceId?.videoId
					);
					const matchedOwnedVideos = ownedVideos.find(
						(ownedVideo) =>
							ownedVideo.resourceId === video.snippet.resourceId?.videoId
					);
					return idx < 12 * (page - 1) ? (
						<div
							key={idx}
							className={`w-full flex flex-col justify-between ${
								matchedWorkInfos
									? 'ring-2 ring-palettered'
									: matchedOwnedVideos
									? 'ring-2 ring-green-500'
									: ''
							}`}
						>
							<div>
								<Image
									src={
										resource.length !== 0
											? video.snippet.thumbnails.maxres?.url ||
											  video.snippet.thumbnails.medium?.url
											: ''
									}
									alt='Thumbnail not available'
									width={1280}
									height={720}
									priority={idx < 6 ? true : false}
									className='w-full object-cover'
								/>
								<div className='mt-2'>
									<div className='text-sm text-[#bababa]'>
										Title : {video.snippet.title}
									</div>
									<div className='text-xs font-light text-[#bababa]'>
										Id : {video.snippet.resourceId?.videoId}
									</div>
								</div>
							</div>
							<div className='mt-2'>
								<Input
									name='title'
									type='text'
									placeholder='타이틀'
									data-resourceid={video.snippet.resourceId?.videoId}
									data-thumbnail={video.snippet.resourceId?.videoId}
									data-description={matchedOwnedVideos?.description}
									data-date={matchedOwnedVideos?.date}
									data-category={matchedOwnedVideos?.category}
									onChange={inputChange}
									onBlur={inputBlur}
									value={
										matchedWorkInfos
											? matchedWorkInfos.title
											: matchedOwnedVideos
											? matchedOwnedVideos.title
											: ''
									}
								/>
								<Input
									name='description'
									type='text'
									placeholder='직무'
									data-resourceid={video.snippet.resourceId?.videoId}
									onChange={inputChange}
									value={
										matchedWorkInfos
											? matchedWorkInfos.description
											: matchedOwnedVideos
											? matchedOwnedVideos.description
											: ''
									}
								/>
								<Input
									name='date'
									type='text'
									placeholder='날짜'
									data-resourceid={video.snippet.resourceId?.videoId}
									onChange={inputChange}
									value={
										matchedWorkInfos
											? matchedWorkInfos.date
											: matchedOwnedVideos
											? matchedOwnedVideos.date
											: ''
									}
								/>
							</div>
						</div>
					) : null;
				})}
			</div>
			<div ref={intersectionRef} className='h-32 my-10 order-last'>
				{fetchLoading ? (
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
