import { GapiItem } from '@/pages/work';
import { SetStateAction, SyntheticEvent, useState } from 'react';

export default function useOnsearch(searchWord: string) {
	const onSearch = (
		e: SyntheticEvent<HTMLFormElement>,
		list: GapiItem[],
		stateFunc: (value: SetStateAction<GapiItem[]>) => void
	) => {
		e.preventDefault();
		if (!searchWord) return;
		stateFunc(list);
	};
	return { onSearch };
}
