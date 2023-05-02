import Layout from '@/components/layout';

export default function Contact() {
	return (
		<Layout seoTitle='Contact' nav={{ isShort: true }} footerAbsolute={true}>
			<section className='relative w-full h-screen flex gap-10 font-GmarketSans overflow-hidden'>
				<div className='relative w-full py-40 flex flex-col items-end justify-between text-right'>
					<div
						style={{ WebkitTextStroke: '1px #eaeaea' }}
						className='font-bold text-[11.25rem] text-[#101010] leading-[8rem]'
					>
						<div>Contact</div>
						<div>us</div>
					</div>
					<div className='font-SCoreDream font-extralight text-4xl'>
						당신의{' '}
						<span className='font-bold'>
							상상이 <br />
							현실이
						</span>{' '}
						될 수 있도록
					</div>
					<ul className='font-light text-2xl leading-none space-y-6'>
						<li className='text-sm -mb-2'>and more</li>
						<li>INSTAGRAM</li>
						<li>VIMEO</li>
						<li>YOUTUBE</li>
					</ul>
				</div>
				<div className='w-full flex flex-col justify-center'>
					<div className='ml-[140px] mr-[260px] flex flex-col items-end min-w-[400px]'>
						<input
							type='text'
							className='w-full bg-[#101010] border-[#cacaca] border-b border-t-0 border-r-0 border-l-0'
						/>
						<input
							type='text'
							className='w-full bg-[#101010] border-[#cacaca] border-b border-t-0 border-r-0 border-l-0'
						/>
						<textarea
							name=''
							rows={9}
							className='w-full block bg-[#101010] border-[#cacaca] border-b border-t-0 border-r-0 border-l-0 resize-none'
						></textarea>
						<button className='w-[100px] h-8 mt-4 bg-[#eaeaea] block text-[#101010] font-bold'>
							<div className='h-full flex justify-center items-center -mb-1'>
								SEND
							</div>
						</button>
					</div>
					<div className='absolute w-full h-full flex justify-center items-center pointer-events-none'>
						<div className='relative w-[1920px] h-[1080px]'>
							<div className='absolute w-[1920px] top-[-46%] aspect-square rounded-full border border-[#707070]' />
							<div className='absolute w-[1920px] bottom-[-46%] aspect-square rounded-full border border-[#A12A37]' />
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
}
