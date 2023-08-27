import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthResponse } from './enter';

export default function Exit() {
	const router = useRouter();
	const [send, { loading, data }] = useMutation<AuthResponse>('/api/admin');

	const onClick = () => {
		if (loading) return;
		send({
			action: 'logout',
			secret: process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN,
		});
	};

	useEffect(() => {
		if (data?.success === true) {
			router.push('work');
		}
	}, [data?.success, router]);

	return (
		<div className='w-screen h-screen flex justify-center items-center bg-pink-500'>
			<div className='max-w-[480px] w-full space-y-1 -translate-y-14 text-center'>
				<div className='mb-4 text-xl font-semibold'>오빠♡ 재밌게 놀았어~?</div>
				<button
					onClick={onClick}
					className='bg-green-600 w-full h-10 font-semibold'
				>
					깔끔하게 퇴장하기
				</button>
			</div>
		</div>
	);
}
