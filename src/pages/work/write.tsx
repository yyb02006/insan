import { fetchYouTubeApi } from '@/libs/client/utils';
import Image from 'next/image';
import { SyntheticEvent, useEffect, useState } from 'react';
import { GapiItem } from '.';
import Input from '@/components/input';

interface WorkInfos {
	title: string;
	description: string;
	resourceId: string;
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
	const inputDelete = () => {};
	const InputChange = (e: SyntheticEvent<HTMLInputElement>) => {
		const { value, name, dataset } = e.currentTarget;
		const workIdx = workInfos?.findIndex(
			(i) => i.resourceId === dataset.resourceid
		);
		if (workIdx !== undefined && workIdx >= 0) {
			if (name === 'title') {
				setWorkInfos((p) =>
					p
						? p.map((arr) =>
								arr.resourceId === dataset.resourceid
									? { ...arr, title: value }
									: arr
						  )
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
			}
		} else {
			console.log('here');
			if (name === 'title') {
				setWorkInfos((p) =>
					p
						? [
								...p,
								{
									resourceId: dataset.resourceid ? dataset.resourceid : '',
									title: '',
									description: '',
								},
						  ]
						: [
								{
									resourceId: dataset.resourceid ? dataset.resourceid : '',
									title: '',
									description: '',
								},
						  ]
				);
			}
		}
	};
	console.log(workInfos);
	return (
		<section>
			<div className='grid grid-cols-3 gap-6 px-20'>
				{test.map((data, arr) => (
					<div key={arr} className='w-full aspect-video'>
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
							data-resourceid={
								data.snippet.resourceId ? data.snippet.resourceId?.videoId : ''
							}
							onChange={InputChange}
						/>
						<Input
							name='description'
							type='text'
							placeholder='설명'
							data-resourceid={
								data.snippet.resourceId ? data.snippet.resourceId?.videoId : ''
							}
							onChange={InputChange}
						/>
					</div>
				))}
			</div>
			<div className='w-[100px] h-[100px] bg-pink-400 fixed right-0 top-0'>
				<button className='w-full bg-amber-400'>Reset</button>
				<button className='w-full bg-purple-400'>Add</button>
			</div>
		</section>
	);
}
