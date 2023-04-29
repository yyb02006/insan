import { SpringOptions, useSpring } from 'framer-motion';
import { MouseEvent } from 'react';

export default function useMouseSpring(
	limitHeight: number = window.innerHeight ? window.innerHeight : 1080,
	xSpringConfig?: SpringOptions,
	ySpringConfig?: SpringOptions
) {
	const mouseX = useSpring(0, xSpringConfig);
	const mouseY = useSpring(0, ySpringConfig);
	const mouseCoord = (opX = 0, opY = 0) => {
		mouseX.set(opX);
		mouseY.set(opY);
	};
	const onMove = (e: MouseEvent) => {
		if (e.pageY < limitHeight || limitHeight === 0) {
			const offsetX = e.clientX - window.innerWidth / 2;
			const offsetY = e.clientY - window.innerHeight / 2;
			mouseCoord(offsetX, offsetY);
		} else {
			mouseCoord();
		}
	};
	const onLeave = () => {
		mouseCoord();
	};
	return { onMove, onLeave, mouseX, mouseY };
}
