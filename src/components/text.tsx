import { MotionValue, useTransform, m, useScroll } from 'framer-motion';
import { ReactNode, useRef } from 'react';
import Circles from './circles';

interface TextSectionMotionProps {
	scrollYProgress: MotionValue<number>;
	scrollStart: number;
	scrollEnd: number;
	isStroke?: boolean;
	css?: string;
	children?: ReactNode;
}

const TextSectionMotionSpan = ({
	scrollYProgress,
	scrollStart,
	scrollEnd,
	css,
	children,
	isStroke = false,
}: TextSectionMotionProps) => {
	const y = useTransform(scrollYProgress, [scrollStart, scrollEnd], [100, 0]);
	const opacity = useTransform(
		scrollYProgress,
		[scrollStart, scrollEnd],
		[0, 1]
	);
	return (
		<m.span
			style={{
				y,
				opacity,
				WebkitTextStroke: isStroke ? '1px #9c9c9c' : undefined,
			}}
			className={css}
		>
			{children}
		</m.span>
	);
};

export default function TextSection() {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});
	const scale = useTransform(scrollYProgress, [0, 0.4], [0.5, 1]);
	const rotate = useTransform(scrollYProgress, [0, 0.4], [90, 0]);
	return (
		<section
			ref={ref}
			className='relative mt-[50vh] h-[70vh] sm:h-[120vh] flex justify-center overflow-hidden'
		>
			<m.div
				style={{ scale, rotate }}
				className='absolute -right-[30vh] sm:-right-[40vh] top-20 h-[40vh] sm:h-[80vh] aspect-square'
			>
				<Circles
					liMotion={{
						css: 'w-[calc(25px+100%)] sm:w-[calc(50px+100%)]',
					}}
				/>
			</m.div>
			<div className='font-GmarketSans font-bold leading-[1.1] text-[#101010] text-[calc(16px+9vw)] pr-0 sm:pr-40'>
				<TextSectionMotionSpan
					scrollYProgress={scrollYProgress}
					scrollStart={0.1}
					scrollEnd={0.2}
					css='block'
					isStroke={true}
				>
					Moves
				</TextSectionMotionSpan>
				<div className='flex flex-col text-[calc(16px+4vw)] text-[#dadada] -mt-0 space-y-2 sm:space-y-0 sm:-mt-6 mb-2 sm:-mb-2 -ml-6 sm:-ml-16'>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.15}
						scrollEnd={0.25}
					>
						좋은 영상을{' '}
						<div className='font-extralight sm:inline'>만든다는 것은,</div>
					</TextSectionMotionSpan>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.2}
						scrollEnd={0.3}
					>
						당신께 감동을{' '}
						<div className='font-extralight sm:inline'>드린다는 것.</div>
					</TextSectionMotionSpan>
				</div>
				<TextSectionMotionSpan
					scrollYProgress={scrollYProgress}
					scrollStart={0.25}
					scrollEnd={0.35}
					css='block'
					isStroke={true}
				>
					Client
				</TextSectionMotionSpan>
				<div className='relative flex flex-col text-[calc(16px+4vw)] text-[#dadada] -mt-0 space-y-2 sm:space-y-0 sm:-mt-6 mb-2 sm:-mb-2 -ml-6 sm:-ml-16'>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.3}
						scrollEnd={0.4}
						css='block absolute text-[calc(16px+9vw)] text-[#101010] -left-8 sm:-left-16'
						isStroke={true}
					>
						&
					</TextSectionMotionSpan>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.3}
						scrollEnd={0.4}
						css='relative'
					>
						상상이 현실이{' '}
						<div className='font-extralight sm:inline'>되는 감동을,</div>
					</TextSectionMotionSpan>
					<TextSectionMotionSpan
						scrollYProgress={scrollYProgress}
						scrollStart={0.37}
						scrollEnd={0.47}
						css='relative'
					>
						더 나은 컨텐츠로의{' '}
						<div className='font-extralight sm:inline'>영감을.</div>
					</TextSectionMotionSpan>
				</div>
				<TextSectionMotionSpan
					scrollYProgress={scrollYProgress}
					scrollStart={0.42}
					scrollEnd={0.52}
					css='block'
					isStroke={true}
				>
					Customer
				</TextSectionMotionSpan>
			</div>
		</section>
	);
}
