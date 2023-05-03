import Circles from '@/components/circles';
import DoubleQuotation from '@/components/doubleQuotaition';
import Layout from '@/components/layout';
import {
	useAnimate,
	motion,
	useScroll,
	useTransform,
	useInView,
} from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { waveChild, waveContainer } from './index';
import { cls } from '@/libs/client/utils';
import Link from 'next/link';

const HeaderSection = () => {
	const [scope, headerAnimate] = useAnimate();
	const { scrollYProgress } = useScroll({
		target: scope,
		offset: ['start start', 'end start'],
	});
	const transform = (scrollEnd: number, valueEnd: number) => {
		return useTransform(scrollYProgress, [0, scrollEnd], [0, valueEnd]);
	};
	useEffect(() => {
		const enterAnimation = async () => {
			await headerAnimate(
				'.Line',
				{ width: ['0%', '100%'] },
				{ duration: 0.6, ease: 'easeInOut' }
			);
			headerAnimate(
				'.TopLetter',
				{ y: [100, 0], opacity: [0, 1] },
				{ duration: 0.4 }
			);
			await headerAnimate(
				'.BottomLetter',
				{ y: [-100, 0], opacity: [0, 1] },
				{ duration: 0.4 }
			);
			headerAnimate('.CircleContainer', { scale: [0, 1] }, { duration: 0.4 });
		};
		enterAnimation();
	}, [headerAnimate]);
	useEffect(() => {
		window.addEventListener('scroll', () => console.log(scrollYProgress.get()));
		window.removeEventListener('scroll', () => {});
	}, []);
	return (
		<section
			ref={scope}
			className='relative h-screen flex flex-col items-center justify-center leading-none font-GmarketSans font-bold text-[7rem]'
		>
			<motion.div
				initial={{ scale: 0 }}
				className='CircleContainer absolute px-6 w-full aspect-square max-w-[716px] flex justify-center items-center'
			>
				<Image
					alt='face'
					width={716}
					height={716}
					src='/images/face.png'
					className='relative'
				/>
				<motion.div
					style={{ rotate: transform(1, 360) }}
					className='absolute w-full h-full origin-center '
				>
					<Circles />
				</motion.div>
			</motion.div>
			<motion.p
				style={{ y: transform(0.5, -800) }}
				className='TopLetter opacity-0 relative flex justify-start break-keep w-[73%]'
			>
				선 좀 넘는 디렉터,
			</motion.p>
			<motion.div
				style={{ y: transform(0.5, -200) }}
				className='Line relative border-t w-0'
			></motion.div>
			<motion.p
				style={{ y: transform(0.5, -400) }}
				className='BottomLetter opacity-0 relative flex mt-5 justify-end w-[73%]'
			>
				여인산입니다.
			</motion.p>
		</section>
	);
};

const WorkIntroSection = () => {
	const descDatas = [
		{
			firstLetter: '새로운 아이디어',
			secondLetter: '와',
			scrollEnd: 0.45,
			distance: '20vh',
		},
		{
			firstLetter: '창의적인 시각',
			secondLetter: '을 바탕으로',
			scrollEnd: 0.6,
			distance: '20vh',
		},
		{
			firstLetter: '다양한 스타일',
			secondLetter: '과 테마,',
			scrollEnd: 0.75,
			distance: '20vh',
		},
		{
			firstLetter: '니즈에 맞는 영상',
			secondLetter: '을 제작합니다.',
			scrollEnd: 0.9,
			distance: '20vh',
		},
	];
	const title = useRef(null);
	const desc = useRef(null);
	const isInview = useInView(title, { amount: 0.5 });
	const { scrollYProgress } = useScroll({
		target: desc,
		offset: ['start end', 'end center'],
	});
	const transform = (
		scrollEnd: number,
		valueStart: number | string,
		valueEnd: number | string
	) => {
		return useTransform(
			scrollYProgress,
			[0, scrollEnd],
			[valueStart, valueEnd]
		);
	};
	return (
		<section className='px-20'>
			<div ref={title} className='h-[100vh] px-24 flex items-center'>
				<DoubleQuotation>
					<motion.div
						initial={'hidden'}
						animate={isInview ? 'visible' : 'hidden'}
						variants={waveContainer}
						custom={0.05}
						className='font-GmarketSans font-bold text-[7rem] flex items-end'
					>
						{Array.from('저는 이런 일을 합니다').map((letter, idx) => {
							if (idx > 2 && idx < 7) {
								return (
									<motion.span
										variants={waveChild}
										style={{ WebkitTextStroke: 0 }}
										className='text-[#eaeaea]'
										key={idx}
									>
										{letter === ' ' ? '\u00A0' : letter}
									</motion.span>
								);
							} else {
								return (
									<motion.span
										variants={waveChild}
										className='text-[#101010]'
										key={idx}
									>
										{letter === ' ' ? '\u00A0' : letter}
									</motion.span>
								);
							}
						})}
					</motion.div>
				</DoubleQuotation>
			</div>
			<ul
				ref={desc}
				className='relative z-[1] px-44 text-[5.125rem] text-[#eaeaea] leading-tight font-SCoreDream font-bold'
			>
				{descDatas.map((data, idx) => (
					<motion.li
						key={idx}
						style={{
							y: transform(data.scrollEnd, data.distance, '0vw'),
							opacity: transform(data.scrollEnd, 0, 1),
						}}
						className={cls(
							idx % 2 === 0 ? 'justify-end' : 'justify-start',
							'flex w-full'
						)}
					>
						{data.firstLetter}
						<span className='font-thin text-[#bababa]'>
							{data.secondLetter}
						</span>
					</motion.li>
				))}
			</ul>
		</section>
	);
};

const RoleIntroSection = () => {
	const [scope, animate] = useAnimate();
	const isInview = useInView(scope, { amount: 0.3 });
	const { scrollYProgress } = useScroll({
		target: scope,
		offset: ['start end', 'end end'],
	});
	useEffect(() => {
		if (isInview) {
			animate(
				'.Image',
				{ y: 0, scale: 1, opacity: 1 },
				{ duration: 0.6, ease: 'easeInOut' }
			);
		}
	}, [isInview]);
	return (
		<section ref={scope} className='px-20 pb-40'>
			<div className='relative w-full mt-20 aspect-video'>
				<motion.div
					initial={{ y: 200, scale: 0.5, opacity: 0.3 }}
					className='Image relative w-full aspect-video overflow-hidden'
				>
					<Image
						src='/images/field.png'
						alt='fieldPicture'
						width={1600}
						height={900}
						className='w-full'
					/>
				</motion.div>
				<motion.div
					style={{ x: useTransform(scrollYProgress, [0.5, 0.9], [300, 0]) }}
					className='absolute font-GmarketSans bottom-16 right-4 bg-[#eaeaea] text-[#101010] text-[4rem] font-bold px-6 py-2'
				>
					Camera, Director, Video Editor
				</motion.div>
			</div>
			<motion.div
				style={{ x: useTransform(scrollYProgress, [0.6, 1], [-300, 0]) }}
				className='w-full py-16 text-5xl leading-none font-bold font-GmarketSans flex items-end pl-40'
			>
				also Product Designer, Drone pilot
			</motion.div>
		</section>
	);
};

const JobIntroSection = () => {
	const descDatas = [
		{
			title: '트렌디한 감각',
			desc: '사람들의 마음을 살 수 있는 감성을 잃지 않으려 노력합니다. 저의 감각은 디자인적 트렌드뿐만 아니라, 드론과 3D촬영같은 기술적 트렌드를 반영하는 것에도 특화되어 있습니다. ',
		},
		{
			title: '융통성 있는 작업과정',
			desc: '여러 사람이 모여 영상컨텐츠를 만들어내는 과정은 곧 예상치 못한 문제를 해결해내는 과정입니다. 컨텐츠가 완성될 때까지 겪게 되는 모든 어려움에 유연하게 대처하고 팀을 이끌어나갈 수 있습니다. ',
		},
		{
			title: '결과에 대한 집착',
			desc: '클라이언트의 요구를 만족시키는 일은 결코 운 좋게 눈속임한 퀄리티로 해낼 수 없습니다. 때문에 영상디자이너는 항상 결과물로 말해야한다는 생각으로 작업에 임합니다. ',
		},
		{
			title: '연구를 즐기는 스타일',
			desc: '영상으로 무언가를 표현한다는 것은 저에게 직업이고 기술이기 이전에, 꿈이자 취미입니다. 메시지를 어떻게 사람들에게 전달할 수 있을지에 대한 고민과 연구를 지금 이 순간에도 하고 있습니다. ',
		},
	];
	const title = useRef(null);
	const desc = useRef(null);
	const isInview = useInView(title, { amount: 0.5 });
	const { scrollYProgress } = useScroll({
		target: desc,
		offset: ['start end', 'end center'],
	});
	return (
		<section className='px-20'>
			<div
				ref={title}
				className='h-[100vh] pb-32 flex justify-end items-center px-24'
			>
				<DoubleQuotation>
					<motion.div
						initial={'hidden'}
						animate={isInview ? 'visible' : 'hidden'}
						variants={waveContainer}
						custom={0.05}
						className='font-GmarketSans font-bold text-[7rem] flex items-end'
					>
						{Array.from('저는 이런 디렉터 입니다').map((letter, idx) => {
							if (idx > 5 && idx < 9) {
								return (
									<motion.span
										variants={waveChild}
										style={{ WebkitTextStroke: 0 }}
										className='text-[#eaeaea]'
										key={idx}
									>
										{letter === ' ' ? '\u00A0' : letter}
									</motion.span>
								);
							} else {
								return (
									<motion.span
										variants={waveChild}
										className='text-[#101010]'
										key={idx}
									>
										{letter === ' ' ? '\u00A0' : letter}
									</motion.span>
								);
							}
						})}
					</motion.div>
				</DoubleQuotation>
			</div>
			<ul
				ref={desc}
				className='relative w-[75%] m-auto grid lg:grid-cols-2 grid-cols-1 justify-items-center text-[15px] items-center aspect-square leading-relaxed'
			>
				{descDatas.map((data, idx) => (
					<li
						key={idx}
						className='relative xl:w-[340px] md:w-[280px] w-[220px] h-[250px] aspect-square flex flex-col justify-between'
					>
						<div className='absolute w-full h-full flex justify-center items-center'>
							<motion.div
								style={{
									y: useTransform(
										scrollYProgress,
										[0.15 * idx, 0.3 + 0.15 * idx],
										[-300, 0]
									),
									opacity: useTransform(
										scrollYProgress,
										[0.15 * idx, 0.3 + 0.15 * idx],
										[0, 1]
									),
								}}
								className='absolute min-w-[500px] w-[40vw] aspect-square border border-[#707070] rounded-full'
							/>
						</div>
						<motion.div
							style={{
								y: useTransform(
									scrollYProgress,
									[0.15 * idx, 0.3 + 0.15 * idx],
									[-100, 0]
								),
								opacity: useTransform(
									scrollYProgress,
									[0.15 * idx, 0.3 + 0.15 * idx],
									[0, 1]
								),
							}}
							className='relative w-full text-[2rem] font-bold'
						>
							{data.title}
						</motion.div>
						<motion.div
							style={{
								y: useTransform(
									scrollYProgress,
									[0.15 * idx, 0.3 + 0.15 * idx],
									[200, 0]
								),
								opacity: useTransform(
									scrollYProgress,
									[0.15 * idx, 0.3 + 0.15 * idx],
									[0, 1]
								),
							}}
							className='relative font-extralight '
						>
							{data.desc}
						</motion.div>
					</li>
				))}
			</ul>
		</section>
	);
};

const OutroSection = () => {
	const [scope, outroAnimate] = useAnimate();
	const isInview = useInView(scope, { amount: 0.3 });
	const onCircleEnter = () => {
		outroAnimate('.Circle', { scale: 1.2 }, { duration: 0.5 });
		outroAnimate('.Text', { color: '#eaeaea' }, { duration: 0.5 });
	};
	const onCircleLeave = () => {
		outroAnimate('.Circle', { scale: 1 }, { duration: 0.5 });
		outroAnimate('.Text', { color: '#101010' }, { duration: 0.2 });
	};
	useEffect(() => {
		if (isInview) {
			outroAnimate(scope.current, { scale: 1 }, { duration: 0.5 });
		} else {
			outroAnimate(scope.current, { scale: 0.5 }, { duration: 0.2 });
		}
	}, [isInview]);
	return (
		<section ref={scope}>
			<Link href='/contact'>
				<div className='relative mt-[40vh] w-full h-[100vh] flex justify-center items-center'>
					<div
						onMouseEnter={onCircleEnter}
						onMouseLeave={onCircleLeave}
						className='relative w-[30%] aspect-square rounded-full flex justify-center items-center'
					>
						<div className='Circle absolute w-full aspect-square'>
							<Circles ulMotion={{ css: 'animate-spin-slow' }} />
						</div>
						<span
							style={{ WebkitTextStroke: '1px #eaeaea' }}
							className='Text relative font-GmarketSans font-bold text-[10rem] text-[#101010]'
						>
							Contact
						</span>
					</div>
				</div>
			</Link>
		</section>
	);
};

export default function About() {
	return (
		<Layout seoTitle='About' nav={{ isShort: true }}>
			{/* overflow-X-hidden시에 스크롤 버그 생김 */}
			<div className='w-full'>
				<HeaderSection />
				<WorkIntroSection />
				<RoleIntroSection />
				<JobIntroSection />
				<OutroSection />
			</div>
		</Layout>
	);
}
