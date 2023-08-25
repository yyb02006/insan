import { useState } from 'react';

interface UseDeleteRequestState<T> {
	loading: boolean;
	data?: T;
	error?: object;
}

type UseDeleteRequest<T> = [
	(data: unknown, secret: string) => void,
	UseDeleteRequestState<T>
];

export default function useDeleteRequest<T = unknown>(
	url: string
): UseDeleteRequest<T> {
	const [deleteState, setDeleteState] = useState<UseDeleteRequestState<T>>({
		loading: false,
		data: undefined,
		error: undefined,
	});
	const deleteRequest = (data: unknown, secret: string) => {
		setDeleteState((p) => ({ ...p, loading: true }));
		fetch(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Ids-To-Delete': JSON.stringify(data),
				'Secret-Token': secret,
			},
		})
			.then((res) =>
				res.json().catch((err) => {
					console.log(err);
				})
			)
			.then((data) => setDeleteState((p) => ({ ...p, data: data })))
			.catch((err) => setDeleteState((p) => ({ ...p, error: err })))
			.finally(() => {
				setDeleteState((p) => ({ ...p, loading: false }));
			});
	};
	return [deleteRequest, { ...deleteState }];
}
