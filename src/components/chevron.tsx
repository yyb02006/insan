import { AnimatePresence, motion, MotionValue, Variants } from 'framer-motion';

interface ChevronProps {
	scrollYProgress: MotionValue<number>;
	isInView?: boolean;
}

const chevron: Variants = {
	visible: {
		y: [-40, 0],
		opacity: [0, 1],
		transition: { ease: 'easeInOut', duration: 1.2 },
	},
	hidden: {
		y: [0, -20],
		opacity: [1, 0],
		transition: { ease: 'easeInOut', duration: 0.4 },
	},
	up: {
		y: [0, -2, 0],
		transition: {
			ease: 'easeInOut',
			duration: 0.6,
			repeat: Infinity,
			delay: 1.2,
		},
	},
	down: {
		y: [0, 2, 0],
		transition: {
			ease: 'easeInOut',
			duration: 0.6,
			repeat: Infinity,
			delay: 1.2,
		},
	},
};

export default function Chevron({ scrollYProgress, isInView }: ChevronProps) {
	return (
		<AnimatePresence>
			{!isInView && scrollYProgress.get() < 0.4 ? (
				<motion.div
					key='chevron'
					exit={'hidden'}
					variants={chevron}
					className='fixed w-full h-full flex justify-center items-end text-[#efefef]'
				>
					<motion.div
						animate={'visible'}
						variants={chevron}
						className='-space-y-4 mb-6'
					>
						<motion.div animate={'up'} variants={chevron}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1}
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M19.5 8.25l-7.5 7.5-7.5-7.5'
								/>
							</svg>
						</motion.div>
						<motion.div animate={'down'} variants={chevron}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1}
								stroke='currentColor'
								className='w-6 h-6'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M19.5 8.25l-7.5 7.5-7.5-7.5'
								/>
							</svg>
						</motion.div>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
