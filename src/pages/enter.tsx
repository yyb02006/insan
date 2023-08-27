import Circles from '@/components/circles';
import Input from '@/components/input';
import useMutation from '@/libs/client/useMutation';
import { useRouter } from 'next/router';
import { SyntheticEvent, useEffect, useState } from 'react';

export interface AuthResponse {
	success: boolean;
	message: string;
	error?: unknown;
}

export default function Admin() {
	const router = useRouter();
	const [password, setPassword] = useState<string>('');
	const [sendPassword, { loading, data }] =
		useMutation<AuthResponse>(`/api/admin`);

	const onPasswordChange = (e: SyntheticEvent<HTMLInputElement>) => {
		setPassword(e.currentTarget.value);
	};

	const onPasswordSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (loading) return;
		sendPassword({
			password,
			action: 'login',
			secret: process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN,
		});
	};

	useEffect(() => {
		if (data?.success === true) {
			router.push('work/write');
		} else if (data?.success === false && data.error) {
			console.log(data.error);
		}
	}, [data?.success, router]);

	return (
		<div className='w-screen h-screen flex justify-center items-center bg-pink-500'>
			<div className='max-w-[480px] w-full space-y-1 -translate-y-14'>
				<form onSubmit={onPasswordSubmit}>
					<Input
						type='text'
						name='password'
						css='border-none placeholder:text-[#bababa]'
						onChange={onPasswordChange}
						value={password}
						placeholder='쟈갸 우리 비밀번호 알지♡'
					></Input>
					<button className='bg-green-600 w-full h-10 font-semibold'>
						여자친구 몰래 입장~♡
					</button>
					{data?.success === false && !data.error ? (
						<span>오빵 실망이양...ㅠㅠ</span>
					) : data?.success === false && data.error ? (
						<span>
							먼가 문제가 있는디? F12 관리자창 열어서 개발자놈한테 에러메세지
							ㄱㄱ
						</span>
					) : null}
				</form>
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
						Secret... <span className='text-palettered'>맞춰버렸다구?~♥</span>
					</div>
				</div>
			) : null}
		</div>
	);
}
