import { useEffect, useState } from 'react';
import { WorkInfos } from './write';
import { cls, fetchApi } from '@/libs/client/utils';
import Image from 'next/image';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';

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
	const onSubmitDeletes = () => {
		if (loading) return;
		send(list?.filter((list) => list.selected === true).map((list) => list.id));
	};
	useEffect(() => {
		if (data?.success) {
			router.push('/work/write');
		}
	}, [router, data]);
	return (
		<section className='grid grid-cols-3'>
			{list?.map((li) => (
				<div
					key={li.id}
					className={cls(li.selected ? 'ring-2' : 'ring-0', 'ring-palettered')}
					onClick={() => {
						setList((p) =>
							p?.map((list) =>
								list.id === li.id ? { ...list, selected: !list.selected } : list
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
					{li.title}/{li.resourceId}
				</div>
			))}
			<div className='w-[100px] h-[100px] bg-pink-400 fixed right-0 top-0'>
				<button className='w-full bg-amber-400'>Reset</button>
				<button onClick={onSubmitDeletes} className='w-full bg-purple-400'>
					Add
				</button>
			</div>
		</section>
	);
}
