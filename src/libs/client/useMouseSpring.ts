import { SpringOptions, motionValue, useSpring } from 'framer-motion';
import { MouseEvent } from 'react';

interface useMouseSpringProps {
	limitHeight: number;
	xSpringConfig?: SpringOptions;
	ySpringConfig?: SpringOptions;
	isMobile: boolean;
}

export default function useMouseSpring({
	limitHeight = window.innerHeight ? window.innerHeight : 1080,
	xSpringConfig,
	ySpringConfig,
	isMobile,
}: useMouseSpringProps) {
	const mouseX = useSpring(0, xSpringConfig);
	const mouseY = useSpring(0, ySpringConfig);
	if (!isMobile) {
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
	} else {
		const onMove = undefined;
		const onLeave = undefined;
		const mouseX = motionValue(0);
		const mouseY = motionValue(0);
		return { onMove, onLeave, mouseX, mouseY };
	}
}
