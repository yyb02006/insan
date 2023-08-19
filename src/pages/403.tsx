import { useRouter } from 'next/router';

export default function Error403() {
	const router = useRouter();
	const onButtonClick = () => {
		router.push('/');
	};
	return (
		<div className='w-screen h-screen flex flex-col justify-center items-center gap-5'>
			<div className='text-6xl text-palettered font-bold'>
				워<span className='text-[#fafafa]'>닝</span>! 워
				<span className='text-[#fafafa]'>닝</span>!
			</div>
			<div className='mb-8 text-sm'>
				<span className='text-palettered'>403</span>에러발생!{' '}
				<span className='text-palettered'>403</span>에러발생!
			</div>
			<button
				onClick={onButtonClick}
				className='border p-4 rounded-2xl hover:border-palettered hover:text-palettered'
			>
				메인페이지로 {`<냉큼/>`}돌아가기
			</button>
		</div>
	);
}
