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
			className='fixed rounded-full bg-green-500 right-6 bottom-6 w-16 aspect-square'
		>
			toTop
		</button>
	);
}
