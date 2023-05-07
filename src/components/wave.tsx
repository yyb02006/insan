import { cls } from '@/libs/client/utils';
import { wave, waveChild, waveContainer } from '@/pages';
import { MotionValue, useInView, useTransform, m } from 'framer-motion';
import { MutableRefObject, useRef } from 'react';

interface WaveSectionProps {
	scrollYProgress: MotionValue<number>;
	inheritRef: MutableRefObject<null>;
	innerWidth: number;
}

interface WaveProps {
	scrollYProgress: MotionValue<number>;
	letter: string[];
	startHeight: number;
	endHeigth: number;
	inViewCondition: number;
	stickyCondition: { top: number; height: string };
	waveSec: number;
	waveReverse?: boolean;
	css?: string;
	letterHeightFix?: number;
	index: number;
	innerWidth: number;
}

const Wave = ({
	scrollYProgress,
	letter,
	startHeight,
	endHeigth,
	inViewCondition,
	stickyCondition,
	waveSec,
	waveReverse = false,
	css = '',
	letterHeightFix = -65,
	index,
	innerWidth,
}: WaveProps) => {
	const y = useTransform(
		scrollYProgress,
		[startHeight, endHeigth],
		[20, letterHeightFix]
	);
	const parent = useRef(null);
	const isInView = useInView(parent, { amount: inViewCondition });
	const visibility = useTransform(scrollYProgress, (value) =>
		value > startHeight ? 'visible' : 'hidden'
	);
	return (
		<div
			ref={parent}
			//cls에 stickyCondition 프로퍼티를 올리고 globalcss 갔다가 오면 이부분만 css 적용이 풀린다 ㅈ버그 ㅅㅂ
			className={cls(
				'sticky',
				index === 1 ? 'top-[35vh] h-[100vh]' : '',
				index === 2 ? 'top-[50vh] h-[55vh]' : '',
				index === 3 ? 'top-[65vh] h-[10vh]' : ''
			)}
		>
			<div className='absolute w-full flex justify-center h-auto'>
				<m.div
					style={{ y, visibility }}
					initial='hidden'
					animate={isInView ? 'visible' : 'hidden'}
					variants={innerWidth > 640 ? waveContainer : {}}
					custom={0.08}
					className={cls(
						css,
						'relative w-full max-w-[1920px] top-9 sm:top-7 md:top-5 lg:top-3 xl:top-0 flex px-[10vw] font-Roboto font-black text-[calc(14px+5.5vw)] text-[#fafafa]'
					)}
				>
					{waveReverse
						? [...letter].reverse().map((test, idx) => (
								<m.span variants={innerWidth > 640 ? waveChild : {}} key={idx}>
									{test === ' ' ? '\u00A0' : test}
								</m.span>
						  ))
						: letter.map((test, idx) => (
								<m.span variants={innerWidth > 640 ? waveChild : {}} key={idx}>
									{test === ' ' ? '\u00A0' : test}
								</m.span>
						  ))}
				</m.div>
			</div>
			<div className='absolute mt-8 md:mt-20 bg-[#101010] w-full h-[200px]' />
			<div className='relative w-[100vw] overflow-x-hidden'>
				<m.div
					initial={{ x: waveReverse ? 0 : '-100vw' }}
					variants={wave(waveSec, waveReverse)}
					className={cls(
						waveReverse ? 'bg-wave-pattern-reverse' : 'bg-wave-pattern',
						'relative w-[200vw] max-h-[400px] aspect-[1920/400] bg-[length:100vw]'
					)}
				></m.div>
			</div>
		</div>
	);
};

export default function WavesSection({
	scrollYProgress,
	inheritRef,
	innerWidth,
}: WaveSectionProps) {
	const waveProps = useRef([
		{
			index: 1,
			letter: Array.from('Future & Hornesty'),
			startHeight: 0.5,
			endHeigth: 0.6,
			inViewCondition: 0.5,
			stickyCondition: { top: 35, height: '100' },
			waveSec: 12,
			waveReverse: false,
		},
		{
			index: 2,
			letter: Array.from('Intuitive & Trendy'),
			startHeight: 0.6,
			endHeigth: 0.7,
			inViewCondition: 0.5,
			stickyCondition: { top: 50, height: '55' },
			waveSec: 10,
			waveReverse: true,
			css: 'flex-row-reverse right-0',
			letterHeightFix: -60,
		},
		{
			index: 3,
			letter: Array.from('Creative & Emotional'),
			startHeight: 0.7,
			endHeigth: 0.8,
			inViewCondition: 0.5,
			stickyCondition: { top: 65, height: '10' },
			waveSec: 8,
			waveReverse: false,
		},
	]);
	return (
		<m.div
			ref={inheritRef}
			animate='wave'
			className='absolute top-[200vh] w-full h-[400vh] pb-[50vh]'
		>
			{waveProps.current.map((prop) =>
				prop.index % 2 === 0 ? (
					<Wave
						key={prop.index}
						scrollYProgress={scrollYProgress}
						letter={prop.letter}
						startHeight={prop.startHeight}
						endHeigth={prop.endHeigth}
						inViewCondition={prop.inViewCondition}
						stickyCondition={prop.stickyCondition}
						waveSec={prop.waveSec}
						waveReverse={prop.waveReverse}
						css={prop.css}
						letterHeightFix={prop.letterHeightFix}
						index={prop.index}
						innerWidth={innerWidth}
					></Wave>
				) : (
					<Wave
						key={prop.index}
						scrollYProgress={scrollYProgress}
						letter={prop.letter}
						startHeight={prop.startHeight}
						endHeigth={prop.endHeigth}
						inViewCondition={prop.inViewCondition}
						stickyCondition={prop.stickyCondition}
						waveSec={prop.waveSec}
						index={prop.index}
						innerWidth={innerWidth}
					></Wave>
				)
			)}
		</m.div>
	);
}
