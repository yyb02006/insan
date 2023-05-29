// import { Stream } from '@prisma/client';
import { useEffect, useState } from 'react';

export default function useInfiniteScroll(
	isLoading: boolean,
	threshold: number = 1,
	condition: /* Stream[] */ undefined | [],
	onIntersecting: () => void
) {
	const [target, setTarget] = useState<HTMLDivElement | null>(null);
	const options = {
		root: null,
		threshold: threshold,
	};

	useEffect(() => {
		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (
					entry.isIntersecting &&
					!isLoading &&
					condition &&
					condition.length > 0
				) {
					onIntersecting();
					observer.unobserve(entry.target);
				}
			});
		}, options);
		if (target) {
			observer.observe(target);
		}
		return () => observer && observer.disconnect();
	}, [target, isLoading, onIntersecting]);

	return setTarget;
}
