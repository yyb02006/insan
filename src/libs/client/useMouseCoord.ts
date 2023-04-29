import { SpringOptions, useSpring } from 'framer-motion';

export default function useMouseCoord(
	limitHeight: number,
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
		if (e.pageY < limitHeight) {
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
