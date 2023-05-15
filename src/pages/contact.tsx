import Layout from '@/components/layout';
import { useAnimate, motion, stagger } from 'framer-motion';
import Link from 'next/link';
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
				'.Links li',
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
				className='relative w-full h-auto min-h-screen lg:h-screen lg:grid lg:grid-cols-2 gap-10 font-GmarketSans overflow-hidden lg:overflow-hidden'
			>
				<div className='relative z-[1] w-full lg:h-full flex items-center'>
					<div className='relative w-full lg:h-full lg:max-h-[1100px] pt-[120px] pb-[40px] lg:py-40 flex flex-col items-center lg:items-end justify-between text-right lg:gap-10'>
						<motion.div
							style={{ WebkitTextStroke: '1px #eaeaea' }}
							className='Title opacity-0 font-bold text-[calc(17.5vw)] sm:text-[calc(40px+7.4vw)] lg:text-[9.5vw] 2xl:text-[11.25rem] text-[#101010] leading-[70%]'
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
						<div className='Letters opacity-0 font-SCoreDream font-extralight text-[calc(10px+1.3vw)] leading-tight'>
							<div className='lg:block hidden'>
								당신의{' '}
								<span className='font-bold'>
									상상이 <br />
									현실이
								</span>{' '}
								될 수 있도록
							</div>
						</div>
						<div className='Links font-light text-[calc(10px+0.75vw)] leading-none '>
							<ul className='lg:block hidden space-y-6'>
								<li className='opacity-0 text-sm -mb-2'>and more</li>
								<li className='opacity-0 hover:text-palettered transition-colors'>
									<Link
										href='https://www.instagram.com/yarg__gray'
										target='_blank'
									>
										INSTAGRAM
									</Link>
								</li>
								<li className='opacity-0 hover:text-palettered transition-colors'>
									<Link href='' target='_blank'>
										VIMEO
									</Link>
								</li>
								<li className='opacity-0 hover:text-palettered transition-colors'>
									<Link
										href='https://www.youtube.com/@insan8871'
										target='_blank'
									>
										YOUTUBE
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className='relative w-full flex items-center justify-center'>
					<div className='mx-10 lg:mx-[60px] flex flex-col items-end max-w-[600px] w-full space-y-4'>
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
