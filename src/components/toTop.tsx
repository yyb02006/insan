import { RefObject, useEffect } from 'react';

interface ToTopProps {
	toScroll: RefObject<HTMLDivElement>;
}

export default function ToTop({ toScroll }: ToTopProps) {
	useEffect(() => {
		console.log('dddddddd' + toScroll);
	}, []);
	const onMoveClick = () => {
		toScroll.current?.scrollIntoView();
	};
	return (
		<button
			onClick={onMoveClick}
			className='fixed rounded-full bg-green-500 right-6 bottom-6 w-12 aspect-square flex justify-center items-center'
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={2}
				stroke='currentColor'
				className='w-full h-full p-3'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18'
				/>
			</svg>
		</button>
	);
}
