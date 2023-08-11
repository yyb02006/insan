import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useUser() {
	const router = useRouter();
	const [user, setUser] = useState();

	const getUser = async () => {
		const userInfo = await (await fetch('/api/work/own')).json();
		console.log(userInfo);
	};

	useEffect(() => {
		getUser();
	}, []);
}
