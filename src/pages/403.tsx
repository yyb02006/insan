import { useRouter } from 'next/router';

export default function Error403() {
	const router = useRouter();
	const onButtonClick = () => {
		router.push('/');
	};
	return (
		<div className='w-screen h-screen flex flex-col justify-center items-center gap-5'>
			<div className='text-sm font-medium'>
				<span className='text-palettered'>403</span> 에러발생!{' '}
				<span className='text-palettered'>403</span> 에러발생!
			</div>
			<div className='mb-8 text-6xl text-palettered leading-tight text-center font-bold'>
				워<span className='text-[#fafafa]'>닝</span>! 워
				<span className='text-[#fafafa]'>닝</span>!<p>당신... 봇 아니야?!</p>
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
