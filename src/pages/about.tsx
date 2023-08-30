import Circles from '@/components/circles';
import DoubleQuotation from '@/components/doubleQuotaition';
import Layout from '@/components/layout';
import {
	useAnimate,
	motion,
	useScroll,
	useTransform,
	useInView,
	MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import { ReactNode, useEffect, useRef } from 'react';
import { waveChild, waveContainer } from './index';
import { cls } from '@/libs/client/utils';
import Link from 'next/link';

interface TransFormYProps {
	scrollYProgress: MotionValue<number>;
	scrollEnd: number;
	valueStart: number;
	valueEnd: number;
	transform: string;
	css: string;
	children?: ReactNode;
}

const ScrollTransformDiv = ({
	scrollYProgress,
	scrollEnd,
	valueStart,
	valueEnd,
	css,
	transform,
	children,
}: TransFormYProps) => {
	const y = useTransform(
		scrollYProgress,
		[0, scrollEnd],
		[valueStart, valueEnd]
	);
	const key: { [key: string]: MotionValue } = {};
	key[transform] = y;
	return (
		<motion.div style={key} className={css}>
			{children}
		</motion.div>
	);
};

const HeaderSection = () => {
	const [scope, headerAnimate] = useAnimate();
	const { scrollYProgress } = useScroll({
		target: scope,
		offset: ['start start', 'end start'],
	});
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
		window.addEventListener('scroll', () => {});
		window.removeEventListener('scroll', () => {});
	}, [scrollYProgress]);
	return (
		<section
			ref={scope}
			className='relative h-screen text-[calc(60px+2.8vw)] flex flex-col items-center justify-center leading-none font-GmarketSans font-bold'
		>
			<motion.div
				initial={{ scale: 0 }}
				className='CircleContainer absolute w-[70vw] max-w-[716px] aspect-square flex justify-center items-center'
			>
				<Image
					alt='face'
					width={716}
					height={716}
					src='/images/face.png'
					className='relative w-full'
				/>
				<ScrollTransformDiv
					scrollYProgress={scrollYProgress}
					scrollEnd={1}
					valueStart={0}
					valueEnd={360}
					transform='rotate'
					css='absolute w-full h-full origin-center'
				>
					<Circles
						liMotion={{ css: 'w-[calc(28px+100%)] sm:w-[calc(50px+100%)]' }}
					/>
				</ScrollTransformDiv>
			</motion.div>
			<ScrollTransformDiv
				scrollYProgress={scrollYProgress}
				scrollEnd={0.5}
				valueStart={0}
				valueEnd={-800}
				transform='y'
				css='TopLetter opacity-0 relative flex justify-start break-keep w-[73%]'
			>
				선 좀 넘는 디렉터,
			</ScrollTransformDiv>
			<ScrollTransformDiv
				scrollYProgress={scrollYProgress}
				scrollEnd={0.5}
				valueStart={0}
				valueEnd={-200}
				transform={'y'}
				css='Line relative border-t w-0'
			/>
			<ScrollTransformDiv
				scrollYProgress={scrollYProgress}
				scrollEnd={0.5}
				valueStart={0}
				valueEnd={-400}
				transform={'y'}
				css='BottomLetter opacity-0 relative flex mt-5 break-keep justify-end w-[73%]'
			>
				여인산
				<wbr />
				입니다.
			</ScrollTransformDiv>
		</section>
	);
};

interface WorkIntroSectionMotionLiProps {
	scrollYProgress: MotionValue<number>;
	scrollEnd: number;
	valueStart: number | string;
	css: string;
	children?: ReactNode;
}

const WorkIntroSectionMotionLi = ({
	scrollYProgress,
	scrollEnd,
	valueStart,
	children,
	css,
}: WorkIntroSectionMotionLiProps) => {
	const y = useTransform(scrollYProgress, [0, scrollEnd], [valueStart, '0vw']);
	const opacity = useTransform(scrollYProgress, [0, scrollEnd], [0, 1]);

	return (
		<motion.li
			style={{
				y,
				opacity,
			}}
			className={css}
		>
			{children}
		</motion.li>
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
	return (
		<section>
			<div
				ref={title}
				className='h-[30vh] sm:h-[100vh] px-16 sm:px-32 flex items-start sm:items-center'
			>
				<DoubleQuotation>
					<motion.div
						initial={'hidden'}
						animate={isInview ? 'visible' : 'hidden'}
						variants={waveContainer}
						custom={0.05}
						className='font-GmarketSans font-bold text-[calc(6px+5.5vw)] flex items-end'
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
				className='relative z-[1] px-[8vw] sm:px-[16vw] text-[calc(6px+4vw)] text-[#eaeaea] leading-tight tracking-tighter font-Pretendard font-bold'
			>
				{descDatas.map((data, idx) => (
					<WorkIntroSectionMotionLi
						key={idx}
						scrollYProgress={scrollYProgress}
						scrollEnd={data.scrollEnd}
						valueStart={data.distance}
						css={cls(
							idx % 2 === 0 ? 'justify-end' : 'justify-start',
							'flex w-full'
						)}
					>
						{data.firstLetter}
						<span className='font-thin text-[#bababa]'>
							{data.secondLetter}
						</span>
					</WorkIntroSectionMotionLi>
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
	}, [isInview, animate]);
	return (
		<section ref={scope} className='sm:px-[9vw] pb-40 mt-8 sm:mt-10'>
			<div className='relative w-full aspect-video'>
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
					className='relative sm:absolute font-GmarketSans top-0 sm:top-auto sm:bottom-16 right-4 bg-[#eaeaea] text-[#101010] text-[calc(40px+1.3vw)] font-bold px-6 py-2'
				>
					<span className='block sm:inline'>Director,</span>{' '}
					<span className='block sm:inline'>PD,</span>{' '}
					<span className='block sm:inline'>Editor</span>
				</motion.div>
			</div>
			<motion.div
				style={{ x: useTransform(scrollYProgress, [0.6, 1], [-300, 0]) }}
				className='w-full py-8 sm:py-16 text-5xl leading-tight sm:leading-none font-bold font-GmarketSans flex items-end pl-60'
			>
				and Camera, Lighting, Drone Operator
			</motion.div>
		</section>
	);
};

interface JobIntroSectionMotionDivProps {
	scrollYProgress: MotionValue<number>;
	idx: number;
	startValue: number;
	css: string;
	children?: ReactNode;
}

const JobIntroSectionMotionDiv = ({
	scrollYProgress,
	idx,
	startValue,
	css,
	children,
}: JobIntroSectionMotionDivProps) => {
	const y = useTransform(
		scrollYProgress,
		[0.15 * idx, 0.3 + 0.15 * idx],
		[startValue, 0]
	);
	const opacity = useTransform(
		scrollYProgress,
		[0.15 * idx, 0.3 + 0.15 * idx],
		[0, 1]
	);
	return (
		<motion.div
			style={{
				y,
				opacity,
			}}
			className={css}
		>
			{children}
		</motion.div>
	);
};

const JobIntroSection = () => {
	const descDatas = [
		{
			title: '트렌디한 감각',
			desc: '사람들의 마음을 살 수 있는 감성을 잃지 않으려 노력합니다. 저의 감각은 디자인적 트렌드뿐만 아니라, 조명운용, 드론촬영 등 기술적 트렌드를 반영하는 것에도 특화되어 있습니다.',
		},
		{
			title: '융통성 있는 작업과정',
			desc: '여러 사람이 모여 영상컨텐츠를 만들어내는 과정은 곧 예상치 못한 문제를 해결해내는 과정입니다. 컨텐츠의 완성까지 겪는 모든 어려움에 유연하게 대처하고 팀을 이끌어나갈 수 있습니다.',
		},
		{
			title: '결과에 대한 집착',
			desc: '클라이언트의 요구를 만족시키는 일은 결코 운 좋게 눈속임한 퀄리티로 해낼 수 없습니다. 때문에 영상디자이너는 항상 결과물로 말해야한다는 생각으로 작업에 임합니다.',
		},
		{
			title: '연구를 즐기는 스타일',
			desc: '영상으로 무언가를 표현하는 것은 저에게 직업이고 기술이기 이전에, 꿈이자 취미입니다. 메시지를 사람들에게 어떻게 전달할지에 대한 고민과 연구는 지금 이 순간에도 진행 중 입니다.',
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
		<section className=''>
			<div
				ref={title}
				className='h-[80vh] sm:h-[100vh] pt-32 sm:pt-0 pb-32 flex justify-center sm:justify-end items-start sm:items-center sm:px-32'
			>
				<DoubleQuotation>
					<motion.div
						initial={'hidden'}
						animate={isInview ? 'visible' : 'hidden'}
						variants={waveContainer}
						custom={0.05}
						className='font-GmarketSans font-bold text-[calc(6px+5.5vw)] flex items-end'
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
				className='relative w-full sm:w-[75%] gap-y-[20vh] sm:gap-x-4 m-auto grid sm:grid-cols-2 grid-cols-1 justify-items-center text-[15px] items-center aspect-square leading-relaxed'
			>
				{descDatas.map((data, idx) => (
					<li
						key={idx}
						className='relative xl:w-[340px] md:w-[260px] sm:w-[200px] w-full px-9 sm:px-0 h-[250px] aspect-square flex flex-col items-center justify-between'
					>
						<div className='absolute w-full h-full flex justify-center items-center'>
							<JobIntroSectionMotionDiv
								scrollYProgress={scrollYProgress}
								idx={idx}
								startValue={-300}
								css='absolute min-w-[500px] w-[40vw] aspect-square border border-[#707070] rounded-full'
							/>
						</div>
						<JobIntroSectionMotionDiv
							scrollYProgress={scrollYProgress}
							idx={idx}
							startValue={-100}
							css='relative w-full text-[2rem] font-bold font-GmarketSans'
						>
							{data.title}
						</JobIntroSectionMotionDiv>
						<JobIntroSectionMotionDiv
							scrollYProgress={scrollYProgress}
							idx={idx}
							startValue={200}
							css='relative font-extralight text-sm sm:text-[0.9375rem] sm:text-[#cacaca] mb-10 sm:mb-6 sm:leading-7 tracking-tighter'
						>
							<span className='leading-relaxed'>{data.desc}</span>
						</JobIntroSectionMotionDiv>
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
	}, [isInview, outroAnimate, scope]);
	return (
		<section ref={scope}>
			<Link href='/contact'>
				<div className='relative mt-[40vh] w-full h-[100vh] flex justify-center items-center'>
					<div
						onMouseEnter={onCircleEnter}
						onMouseLeave={onCircleLeave}
						className='relative w-[calc(160px+20vw)] aspect-square rounded-full flex justify-center items-center'
					>
						<div className='Circle absolute w-full aspect-square'>
							<Circles
								ulMotion={{ css: 'animate-spin-slow' }}
								liMotion={{ css: 'w-[110%]' }}
							/>
						</div>
						<span
							style={{ WebkitTextStroke: '1px #eaeaea' }}
							className='Text relative font-GmarketSans font-bold text-[calc(40px+8.2vw)] text-[#101010]'
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
		<Layout seoTitle='ABOUT' nav={{ isShort: true }}>
			{/* overflow-X-hidden시에 스크롤 버그 생김 */}
			<main className='w-full overflow-x-hidden scrollbar-hide'>
				<HeaderSection />
				<WorkIntroSection />
				<RoleIntroSection />
				<JobIntroSection />
				<OutroSection />
			</main>
		</Layout>
	);
}
