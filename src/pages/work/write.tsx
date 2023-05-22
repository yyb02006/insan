import { fetchApi } from '@/libs/client/utils';
import { fetchYouTubeApi } from '@/libs/client/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { GapiItem } from '.';

export default function Write() {
	const lists = [
		{ title: '외주 작업', id: 'PL3Sx9O__-BGnKsABX4khAMW6BBFF_Hf40' },
		{ title: '참여 촬영', id: 'PL3Sx9O__-BGlyWzd0DnpZT9suTNy4kBW1' },
	];
	const [test, setTest] = useState<GapiItem[]>([]);
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
	console.log(test.length);
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
