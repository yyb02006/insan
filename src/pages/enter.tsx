import Input from '@/components/input';
import useMutation from '@/libs/client/useMutation';
import useUser from '@/libs/client/useUser';
import { useRouter } from 'next/router';
import { SyntheticEvent, useEffect, useState } from 'react';

export interface AuthResponse {
	success: boolean;
	message: string;
}

export default function Admin() {
	const router = useRouter();
	const [password, setPassword] = useState<string>('');
	const [sendPassword, { loading, data }] = useMutation<AuthResponse>(
		`/api/enter?secret=${process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN}`
	);
	const [user, authLoading] = useUser({ approvedRedirectUrl: 'work/write' });

	const onPasswordChange = (e: SyntheticEvent<HTMLInputElement>) => {
		setPassword(e.currentTarget.value);
	};

	const onPasswordSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendPassword(password);
	};

	useEffect(() => {
		if (data?.success === true) {
			router.push('work/write');
		}
	}, [data?.success, router]);

	return (
		<div className='w-screen h-screen flex justify-center items-center bg-pink-500'>
			<div className='max-w-[480px] w-full space-y-1 -translate-y-14'>
				{user ? (
					<div className='text-4xl'>♡어서와 오빵♡</div>
				) : (
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
						{data?.success === false ? <span>오빵 실망이양...ㅠㅠ</span> : null}
					</form>
				)}
			</div>
		</div>
	);
}
