import { cls, fetchYouTubeApi } from '@/libs/client/utils';
import Image from 'next/image';
import { SyntheticEvent, useEffect, useState } from 'react';
import { GapiItem } from '.';
import Input from '@/components/input';
import useMutation from '@/libs/client/useMutation';
import Layout from '@/components/layout';
import Link from 'next/link';

export interface WorkInfos {
	title: string;
	description: string;
	resourceId: string;
	category: string;
}

export default function Write() {
	const [category, setCategory] = useState<'film&short' | 'outsource'>(
		'film&short'
	);
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
			} else if (name === 'category') {
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
									category: category === 'film&short' ? '' : 'outsource',
								},
						  ]
						: [
								{
									resourceId: dataset.resourceid ? dataset.resourceid : '',
									title: value,
									description: '',
									category: category === 'film&short' ? '' : 'outsource',
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
				{category === 'film&short' ? <></> : null}
				{category === 'outsource' ? (
					<>
						<form
							onSubmit={() => {}}
							className='relative mb-8 mt-4 font-light flex items-center gap-2 pb-1 border-b border-[#9a9a9a] text-lg leading-tight text-[#eaeaea]'
						>
							<button>
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
								onChange={() => {}}
							/>
						</form>
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
											<div className='text-sm'>
												Title : {data.snippet.title}
											</div>
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
																arr.resourceId ===
																data.snippet.resourceId?.videoId
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
																arr.resourceId ===
																data.snippet.resourceId?.videoId
															);
													  })?.description
													: ''
											}
										/>
										{/* <Input
											type='radio'
											name='category'
											value='film'
											radioId={`${data.id}film`}
											onClick={InputChange}
											data-resourceid={
												data.snippet.resourceId
													? data.snippet.resourceId?.videoId
													: ''
											}
											css=''
											labelCss=''
											labelName='film'
										/>
										<Input
											type='radio'
											name='category'
											value='short'
											radioId={`${data.id}short`}
											onClick={InputChange}
											data-resourceid={
												data.snippet.resourceId
													? data.snippet.resourceId?.videoId
													: ''
											}
											css=''
											labelCss=''
											labelName='short'
										/>
										<Input
											type='radio'
											name='category'
											value='outsource'
											radioId={`${data.id}outsource`}
											onClick={InputChange}
											data-resourceid={
												data.snippet.resourceId
													? data.snippet.resourceId?.videoId
													: ''
											}
											css=''
											labelCss=''
											labelName='outsource'
										/> */}
									</div>
								</div>
							))}
						</div>
					</>
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
				</div>
			</section>
		</Layout>
	);
}
