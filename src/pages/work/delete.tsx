import { useEffect, useState } from 'react';
import { WorkInfos } from './write';
import { cls, fetchApi } from '@/libs/client/utils';
import Image from 'next/image';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';

interface list extends WorkInfos {
	id: number;
}

interface listState extends list {
	selected: boolean;
}

interface dataState {
	success: boolean;
	list: list[];
}

export default function Delete() {
	const [list, setList] = useState<listState[]>();
	const [send, { loading, data }] = useMutation<{ success: boolean }>(
		'/api/work'
	);
	const router = useRouter();
	useEffect(() => {
		fetchApi(
			'/api/work',
			(data: dataState) =>
				setList(data.list.map((list) => ({ ...list, selected: false }))),
			{ method: 'GET' }
		);
	}, []);
	const onSubmitDelete = () => {
		if (loading) return;
		send(list?.filter((list) => list.selected === true).map((list) => list.id));
	};
	useEffect(() => {
		if (data?.success) {
			router.push('/work/write');
		}
	}, [router, data]);
	const onReset = () => {
		setList((p) => p?.map((arr) => ({ ...arr, selected: false })));
	};
	return (
		<Layout seoTitle='Write' footerPosition='hidden' nav={{ isShort: true }}>
			<section className='relative xl:px-40 sm:px-24 px-16'>
				<div className='h-[100px] flex items-center justify-center font-GmarketSans font-bold text-3xl'>
					삭제하기
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '>
					{list?.map((li) => (
						<div
							key={li.id}
							className={cls(
								li.selected ? 'ring-2' : 'ring-0',
								'ring-palettered'
							)}
							onClick={() => {
								setList((p) =>
									p?.map((list) =>
										list.id === li.id
											? { ...list, selected: !list.selected }
											: list
									)
								);
							}}
						>
							<Image
								src={
									list.length !== 0
										? `https://i.ytimg.com/vi/${li.resourceId}/maxresdefault.jpg` ||
										  `https://i.ytimg.com/vi/${li.resourceId}/sddefault.jpg` ||
										  `https://i.ytimg.com/vi/${li.resourceId}/mqdefault.jpg`
										: ''
								}
								alt='test'
								width={1280}
								height={720}
								className='w-full object-cover'
								priority
							/>
							<div className='mt-2'>
								<div className='text-sm'>Title : {li.title}</div>
								<div className='text-xs font-light'>Id : {li.resourceId}</div>
							</div>
						</div>
					))}
					<div className='w-[60px] ring-1 ring-palettered rounded-full fixed xl:right-20 sm:right-4 top-[100px]'>
						<button
							onClick={onReset}
							className='w-full ring-1 ring-palettered aspect-square rounded-full font-light text-sm hover:text-palettered hover:font-bold'
						>
							Reset
						</button>
						<button
							onClick={onSubmitDelete}
							className='w-full ring-1 ring-palettered aspect-square rounded-full font-light text-sm hover:text-palettered hover:font-bold'
						>
							Delete
						</button>
					</div>
				</div>
			</section>
		</Layout>
	);
}
