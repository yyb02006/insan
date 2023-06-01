import { useEffect, useState } from 'react';
import { WorkInfos } from './write';
import { cls, fetchApi } from '@/libs/client/utils';
import Image from 'next/image';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Link from 'next/link';

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
		<Layout
			seoTitle='Delete'
			footerPosition='hidden'
			nav={{ isShort: true }}
			menu={false}
		>
			<section className='relative xl:px-40 sm:px-24 px-16'>
				<div className='h-[100px] flex items-center justify-center font-GmarketSans font-bold text-3xl'>
					삭제하기
				</div>
				<div className='fixed right-0 top-0 mr-[40px] md:mr-[60px] h-[100px] flex items-center text-sm'>
					<Link href={'/work/write'}>추가하기</Link>
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
					<div className='sm:w-[60px] flex sm:block h-14 sm:h-auto w-full sm:ring-1 sm:ring-palettered sm:rounded-full fixed xl:right-20 sm:right-4 right-0 sm:top-[100px] sm:bottom-auto bottom-0'>
						<button
							onClick={onReset}
							className='w-full ring-1 ring-palettered aspect-square sm:rounded-full bg-[#101010] sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
						>
							Reset
						</button>
						<button
							onClick={onSubmitDelete}
							className='w-full ring-1 ring-palettered aspect-square bg-palettered sm:bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm sm:hover:text-palettered sm:hover:font-bold'
						>
							Delete
						</button>
					</div>
				</div>
			</section>
		</Layout>
	);
}
