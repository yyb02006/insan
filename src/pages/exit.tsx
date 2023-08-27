import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthResponse } from './enter';
import Circles from '@/components/circles';

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
			router.push('/work');
		} else if (data?.success === false) {
			console.log(data.error);
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
					손씻고 퇴장하기
				</button>
			</div>
			{loading ? (
				<div className='fixed top-0 w-screen h-screen opacity-60 z-[1] flex justify-center items-center bg-black'>
					<div className='animate-spin-middle contrast-50 absolute w-[100px] aspect-square'>
						<Circles
							liMotion={{
								css: 'w-[calc(16px+100%)] border-[#eaeaea] border-1',
							}}
						/>
					</div>
				</div>
			) : null}
			{data?.success === true ? (
				<div className='fixed top-0 w-screen h-screen opacity-60 z-[1] flex justify-center items-center bg-black'>
					<div>
						잘가... <span className='text-palettered'>쟉이~♥</span>
					</div>
				</div>
			) : data?.error ? (
				<div className='fixed top-0 w-screen h-screen opacity-60 z-[1] flex justify-center items-center bg-black'>
					<div>
						먼가 문제가 있는디? F12 관리자창 열어서 개발자놈한테 에러메세지 ㄱㄱ
					</div>
				</div>
			) : null}
		</div>
	);
}
