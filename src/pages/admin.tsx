import Input from '@/components/input';
import useMutation from '@/libs/client/useMutation';
import { SyntheticEvent, useState } from 'react';

export default function Admin() {
	const [password, setPassword] = useState<string>('');
	const [sendPassword, { loading }] = useMutation<string>('api/enter');

	const onPasswordChange = (e: SyntheticEvent<HTMLInputElement>) => {
		setPassword(e.currentTarget.value);
	};

	const onPasswordSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendPassword(password);
	};

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
				</form>
			</div>
		</div>
	);
}
