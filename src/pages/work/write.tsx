import { fetchYouTubeApi } from '@/libs/client/utils';
import Image from 'next/image';
import { SyntheticEvent, useEffect, useState } from 'react';
import { GapiItem } from '.';
import Input from '@/components/input';

interface WorkInfos {
	title: string;
	description: string;
	resourceId: string;
	thumbnail: string;
}

export default function Write() {
	const lists = [
		{ title: '외주 작업', id: 'PL3Sx9O__-BGnKsABX4khAMW6BBFF_Hf40' },
		{ title: '참여 촬영', id: 'PL3Sx9O__-BGlyWzd0DnpZT9suTNy4kBW1' },
	];
	const [test, setTest] = useState<GapiItem[]>([]);
	const [workInfos, setWorkInfos] = useState<WorkInfos[]>();
	useEffect(() => {
		lists.forEach((list) => {
			fetchYouTubeApi(
				'playlistItems',
				'10',
				(data: { items: GapiItem[] }) => {
					setTest((p) => [...p, ...data.items]);
				},
				'(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)))',
				list.id
			);
		});
	}, []);
	const InputChange = (e: SyntheticEvent<HTMLInputElement>) => {
		console.log(e.currentTarget.name);
		const workIdx = workInfos?.findIndex(
			(i) => i.resourceId === e.currentTarget.id
		);
		console.log(workIdx);
		if (workIdx !== undefined && workIdx >= 0) {
			const { value, id, name } = e.currentTarget;
			if (name === 'title') {
				setWorkInfos((p) =>
					p
						? p.map((arr) =>
								arr.resourceId === id ? { ...arr, title: value } : arr
						  )
						: undefined
				);
			} else if (name === 'description') {
				setWorkInfos((p) =>
					p
						? p.map((arr) =>
								arr.resourceId === id ? { ...arr, description: value } : arr
						  )
						: undefined
				);
			}
		} else {
			console.log('here');
			const { id } = e.currentTarget;
			setWorkInfos((p) =>
				p
					? [
							...p,
							{
								resourceId: id,
								title: '',
								description: '',
								thumbnail: '',
							},
					  ]
					: [
							{
								resourceId: id,
								title: '',
								description: '',
								thumbnail: '',
							},
					  ]
			);
		}
	};
	console.log(workInfos);

	return (
		<section className='grid grid-cols-3'>
			{test.map((data, arr) => (
				<div key={arr} className='w-[400px] h-[400px]'>
					<Image
						src={
							test.length !== 0
								? data.snippet.thumbnails.maxres?.url ||
								  data.snippet.thumbnails.medium?.url
								: ''
						}
						alt='test'
						width={1280}
						height={720}
						className='w-full object-cover'
					/>
					{data.snippet.title}/{data.snippet.resourceId?.videoId}
					<Input
						name='title'
						type='text'
						placeholder='타이틀'
						id={data.snippet.resourceId ? data.snippet.resourceId?.videoId : ''}
						onChange={InputChange}
					/>
					<Input
						name='description'
						type='text'
						placeholder='설명'
						id={data.snippet.resourceId ? data.snippet.resourceId?.videoId : ''}
						onChange={InputChange}
					/>
				</div>
			))}
			{/* <YouTube
				videoId='Vg4aCFlRrsI'
				opts={{
					width: '100%',
					height: '100%',
					playerVars: { rel: 0, modestbranding: 1 },
					host: 'https://www.youtube-nocookie.com',
					origin: 'http://localhost:3000',
				}}
				loading='lazy'
			/> */}
		</section>
	);
}
