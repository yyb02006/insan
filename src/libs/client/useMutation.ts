import { useState } from 'react';

interface UseMutationState<T> {
	loading: boolean;
	data?: T;
	error?: object;
}

type UseMutation<T> = [(data: unknown) => void, UseMutationState<T>];

export default function useMutation<T = unknown>(url: string): UseMutation<T> {
	const [mutationState, setMutationState] = useState<UseMutationState<T>>({
		loading: false,
		data: undefined,
		error: undefined,
	});
	const mutation = (data: unknown) => {
		setMutationState((p) => ({ ...p, loading: true }));
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) =>
				res.json().catch((err) => {
					console.log(err);
				})
			)
			.then((data) => setMutationState((p) => ({ ...p, data: data })))
			.catch((err) => setMutationState((p) => ({ ...p, error: err })))
			.finally(() => {
				setMutationState((p) => ({ ...p, loading: false }));
			});
	};
	return [mutation, { ...mutationState }];
}
