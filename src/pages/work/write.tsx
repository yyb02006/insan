import { fetchYouTubeApi } from '@/libs/client/utils';
import Image from 'next/image';
import { SyntheticEvent, useEffect, useState } from 'react';
import { GapiItem } from '.';
import Input from '@/components/input';
import useMutation from '@/libs/client/useMutation';
import Layout from '@/components/layout';

export interface WorkInfos {
	title: string;
	description: string;
	resourceId: string;
}

export default function Write() {
	const lists = [
		{ title: '외주 작업', id: 'PL3Sx9O__-BGnKsABX4khAMW6BBFF_Hf40' },
		{ title: '참여 촬영', id: 'PL3Sx9O__-BGlyWzd0DnpZT9suTNy4kBW1' },
	];
	const [list, setList] = useState<GapiItem[]>([]);
	const [sendList, { loading }] = useMutation<WorkInfos[]>('/api/work/write');
	const [workInfos, setWorkInfos] = useState<WorkInfos[]>();
	useEffect(() => {
		lists.forEach((list) => {
			fetchYouTubeApi(
				'playlistItems',
				'10',
				(data: { items: GapiItem[] }) => {
					setList((p) => [...p, ...data.items]);
				},
				'(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)))',
				list.id
			);
		});
	}, []);
	const InputChange = (e: SyntheticEvent<HTMLInputElement>) => {
		const { value, name, dataset } = e.currentTarget;
		const workIdx = workInfos?.findIndex(
			(i) => i.resourceId === dataset.resourceid
		);
		console.log(e.currentTarget.value);
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
									title: value,
									description: '',
								},
						  ]
						: [
								{
									resourceId: dataset.resourceid ? dataset.resourceid : '',
									title: value,
									description: '',
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
	console.log(workInfos);
	return (
		<Layout seoTitle='Write' footerPosition='hidden' nav={{ isShort: true }}>
			<section className='relative xl:px-40 sm:px-24 px-16'>
				<div className='h-[100px] flex items-center justify-center font-GmarketSans font-bold text-3xl'>
					작성하기
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
					{list.map((data, arr) => (
						<div key={arr} className='w-full flex flex-col justify-between'>
							<div>
								<Image
									src={
										list.length !== 0
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
										data.snippet.resourceId
											? data.snippet.resourceId?.videoId
											: ''
									}
									onChange={InputChange}
									value={
										workInfos?.find((arr) => {
											return (
												arr.resourceId === data.snippet.resourceId?.videoId
											);
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
										data.snippet.resourceId
											? data.snippet.resourceId?.videoId
											: ''
									}
									onChange={InputChange}
									value={
										workInfos?.find((arr) => {
											return (
												arr.resourceId === data.snippet.resourceId?.videoId
											);
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
				<div className='w-[60px] ring-1 ring-palettered rounded-full fixed xl:right-20 sm:right-4 top-[100px]'>
					<button
						onClick={onReset}
						className='w-full ring-1 ring-palettered aspect-square rounded-full font-light text-sm hover:text-palettered hover:font-bold'
					>
						Reset
					</button>
					<button
						onClick={onSubmitWrites}
						className='w-full ring-1 ring-palettered aspect-square rounded-full font-light text-sm hover:text-palettered hover:font-bold'
					>
						Save
					</button>
				</div>
			</section>
		</Layout>
	);
}
