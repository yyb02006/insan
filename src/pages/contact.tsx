import Layout from '@/components/layout';
import { useAnimate, motion, stagger } from 'framer-motion';
import { useEffect } from 'react';

export default function Contact() {
	const [scope, animate] = useAnimate();
	useEffect(() => {
		const enterAnimation = async () => {
			await animate(
				'.Title',
				{ x: [-50, 0], opacity: [0, 1] },
				{ duration: 0.3 }
			);
			animate(
				'.Input',
				{ x: [100, 0], opacity: [0, 1] },
				{ delay: stagger(0.2) }
			);
			await animate(
				'.Letters',
				{ x: [-50, 0], opacity: [0, 1] },
				{ duration: 0.3 }
			);
			await animate(
				'.Links > li',
				{ x: [-50, 0], opacity: [0, 1] },
				{ delay: stagger(0.1) }
			);
			animate(
				'.Title > div > span',
				{ color: ['#101010', '#eaeaea', '#eaeaea', '#101010'] },
				{
					duration: 8,
					times: [0, 0.2, 0.4, 0.6],
					delay: stagger(0.2),
					ease: 'easeInOut',
					repeat: Infinity,
				}
			);
		};
		enterAnimation();
	}, [animate]);
	return (
		<Layout
			seoTitle='Contact'
			nav={{ isShort: true }}
			footerPosition='absolute'
		>
			<section
				ref={scope}
				className='relative w-full h-screen flex gap-10 font-GmarketSans overflow-hidden'
			>
				<div className='relative w-full h-full flex items-center'>
					<div className='relative w-full min-h-[900px] max-h-[1100px] h-full py-40 flex flex-col items-end justify-between text-right'>
						<motion.div
							style={{ WebkitTextStroke: '1px #eaeaea' }}
							className='Title opacity-0 font-bold text-[11.25rem] text-[#101010] leading-[8rem]'
						>
							<div>
								{Array.from('Contact').map((arr, idx) => (
									<span key={idx}>{arr}</span>
								))}
							</div>
							<div>
								{Array.from('us').map((arr, idx) => (
									<span key={idx}>{arr}</span>
								))}
							</div>
						</motion.div>
						<div className='Letters opacity-0 font-SCoreDream font-extralight text-4xl'>
							당신의{' '}
							<span className='font-bold'>
								상상이 <br />
								현실이
							</span>{' '}
							될 수 있도록
						</div>
						<ul className='Links font-light text-2xl leading-none space-y-6'>
							<li className='opacity-0 text-sm -mb-2'>and more</li>
							<li className='opacity-0'>INSTAGRAM</li>
							<li className='opacity-0'>VIMEO</li>
							<li className='opacity-0'>YOUTUBE</li>
						</ul>
					</div>
				</div>
				<div className='w-full flex flex-col justify-center'>
					<div className='ml-[140px] mr-[260px] flex flex-col items-end min-w-[400px] space-y-4'>
						<input
							placeholder='Name'
							type='text'
							className='Input font-light placeholder:text-[#eaeaea] opacity-0 w-full bg-[#101010] border-[#cacaca] border-b border-t-0 border-r-0 border-l-0'
						/>
						<input
							placeholder='Your E-mail address'
							type='text'
							className='Input font-light placeholder:text-[#eaeaea] opacity-0 w-full bg-[#101010] border-[#cacaca] border-b border-t-0 border-r-0 border-l-0'
						/>
						<textarea
							placeholder='Type your message'
							name=''
							rows={9}
							className='Input font-light placeholder:text-[#eaeaea] opacity-0 w-full block bg-[#101010] border-[#cacaca] border-b border-t-0 border-r-0 border-l-0 resize-none'
						></textarea>
						<button className='Input placeholder:text-[#eaeaea] opacity-0 w-[100px] h-8 bg-[#eaeaea] block text-[#101010] font-bold'>
							<div className='h-full flex justify-center items-center -mb-1'>
								SEND
							</div>
						</button>
					</div>
					<div className='absolute w-full h-full flex justify-start items-center pointer-events-none'>
						<div className='relative w-[1080px] h-[1080px]'>
							<div className='absolute w-[1920px] top-[-46%] aspect-square rounded-full border border-[#707070]' />
							<div className='absolute w-[1920px] bottom-[-46%] aspect-square rounded-full border border-[#A12A37]' />
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
}
