import Input from '@/components/input';
import Layout from '@/components/layout';
import useMutation from '@/libs/client/useMutation';
import { cls } from '@/libs/client/utils';
import { useAnimate, motion, stagger } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

	const [inputDatas, setInputDatas] = useState({
		title: '',
		email: '',
		message: '',
	});
	const [resultMessage, setResultMessage] = useState<{
		state: 'error' | 'resolve';
		message: string;
	}>({ state: 'error', message: '' });
	const [send, { loading, data }] = useMutation<{ success: boolean }>(
		'/api/email'
	);

	const onChange = (
		e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { value, name } = e.currentTarget;
		setInputDatas((p) => ({
			...p,
			[name]: value,
		}));
	};
	const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (loading) return;
		if (!inputDatas.title || !inputDatas.email || !inputDatas.message) {
			setResultMessage({ state: 'error', message: '빈 칸을 작성해주십숑' });
			return;
		} else if (!inputDatas.email.includes('@')) {
			setResultMessage({
				state: 'error',
				message: '이메일 형식을 확인해주십숑',
			});
			return;
		} else {
			setResultMessage({ state: 'resolve', message: '메일 전송중...' });
			send(inputDatas);
		}
	};

	useEffect(() => {
		if (data?.success === true) {
			setResultMessage({
				state: 'resolve',
				message: '메일전송에 성공했습니다!',
			});
			setInputDatas({ title: '', email: '', message: '' });
		} else if (data?.success === false) {
			setResultMessage({ state: 'error', message: '메일전송에 실패했습니다.' });
		} else {
			return;
		}
	}, [data]);

	return (
		<Layout seoTitle='Contact' nav={{ isShort: true }} footerPosition='hidden'>
			<section
				ref={scope}
				className='relative w-full h-auto min-h-screen lg:h-screen lg:grid lg:grid-cols-2 gap-10 font-GmarketSans overflow-hidden lg:overflow-x-hidden lg:overflow-y-scroll scrollbar-hide'
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
						<div className='Letters opacity-0 font-Pretendard font-extralight text-[calc(10px+1.3vw)] leading-tight'>
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
									<Link href='https://vimeo.com/user136249834' target='_blank'>
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
				<div className='relative w-full flex items-center justify-center pb-16 lg:pb-0'>
					<form
						onSubmit={onSubmit}
						className='mx-10 lg:mx-[60px] flex flex-col items-end max-w-[600px] w-full space-y-4'
					>
						<Input
							type='text'
							name='title'
							placeholder='Title'
							onChange={onChange}
							css='Input opacity-0 border-[#cacaca] border-b border-t-0 border-r-0 border-l-0'
							value={inputDatas.title}
						/>
						<Input
							type='text'
							name='email'
							placeholder='Your E-mail address'
							onChange={onChange}
							css='Input opacity-0 border-[#cacaca] border-b border-t-0 border-r-0 border-l-0'
							value={inputDatas.email}
						/>
						<Input
							type='textarea'
							name='message'
							placeholder='Type your message'
							rows={9}
							onChange={onChange}
							css='Input opacity-0 border-[#cacaca] border-b border-t-0 border-r-0 border-l-0'
							value={inputDatas.message}
						/>
						<div className='space-x-4'>
							<span
								className={cls(
									resultMessage.state === 'resolve'
										? 'text-green-500'
										: 'text-palettered',
									'font-Pretendard font-medium text-sm'
								)}
							>
								{resultMessage.message}
							</span>
							<button className='Input placeholder:text-[#eaeaea] opacity-0 w-[100px] h-8 bg-[#eaeaea] text-[#101010] font-bold'>
								<div className='h-full flex justify-center items-center -mb-1'>
									{loading ? <span>WAIT</span> : <span>SEND</span>}
								</div>
							</button>
						</div>
					</form>
					<div className='absolute left-0 w-full h-full lg:overflow-hidden flex justify-start items-start pointer-events-none'>
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
