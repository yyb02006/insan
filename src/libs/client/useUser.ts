import { AuthResponse } from '@/pages/admin';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface UseUserProps {
	DeniedRedirectUrl?: string;
	approvedRedirectUrl?: string;
}

export default function useUser({
	DeniedRedirectUrl,
	approvedRedirectUrl,
}: UseUserProps) {
	const router = useRouter();
	const [user, setUser] = useState<AuthResponse>();
	const [loading, setLoaing] = useState(false);

	useEffect(() => {
		const getUser = async () => {
			setLoaing(true);
			const userInfo = await (await fetch('/api/work/own')).json();
			setUser(userInfo);
			setLoaing(false);
		};
		getUser();
	}, []);

	useEffect(() => {
		if (user && user.success === false) {
			DeniedRedirectUrl && router.push(DeniedRedirectUrl);
		} else if (user && user.success === true) {
			approvedRedirectUrl && router.push(approvedRedirectUrl);
		}
	}, [user]);

	return [user?.success, loading];
}
