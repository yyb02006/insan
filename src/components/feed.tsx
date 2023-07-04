import { GapiItem } from '@/pages/work';
import Image from 'next/image';
import Input from './input';
import { SyntheticEvent } from 'react';
import { WorkInfos } from '@/pages/work/write';

interface feedProps {
	searchResult: GapiItem[];
	inputChange: (e: SyntheticEvent<HTMLInputElement>) => void;
	workInfos: WorkInfos[] | undefined;
}

export default function Feed({
	searchResult,
	inputChange,
	workInfos,
}: feedProps) {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
			{searchResult.map((data, arr) => (
				<div key={arr} className='w-full flex flex-col justify-between'>
					<div>
						<Image
							src={
								searchResult.length !== 0
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
