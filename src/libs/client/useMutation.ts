import { useState } from 'react';

export default function useMutation(url: string) {
	const [mutationState, setMutationState] = useState({
		loading: false,
		data: undefined,
		error: undefined,
	});
	const mutation = (data: unknown) => {};
}
