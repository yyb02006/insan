import Link from 'next/link';

export default function Error403() {
	return (
		<div className='w-screen h-screen flex flex-col justify-center items-center'>
			<div className='text-sm font-medium'>
				<span className='text-palettered'>404</span> 에러발생!{' '}
				<span className='text-[#606060]'>
					{'( 404TMI : 보여줄 페이지가 없다는 뜻 )'}
				</span>
			</div>
			<div className='mt-6 mb-16 underline underline-offset-8 text-6xl leading-tight text-[#eaeaea] font-bold text-center'>
				정말 <span className='text-palettered'>{'<죄송!/>'}</span>합니다.
				<br />이 페이지는 <span className='text-palettered'>없는</span> 페이지
				입니다.
			</div>
			<Link
				href={'/'}
				className='border p-4 rounded-2xl hover:border-palettered hover:text-palettered'
			>
				메인페이지로 <span className='text-palettered'>{`<냉큼/>`}</span>
				돌아가기
			</Link>
		</div>
	);
}
