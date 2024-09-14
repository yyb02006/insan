import { AuthResponse } from '@/pages/enter';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 *
 * 유저 판단 후 결과를 반환하거나 리다이렉트하는 훅
 *
 * @param {string} DeniedRedirectUrl - 접근이 거부된 경우 리다이렉트할 URL
 * @param {string} approvedRedirectUrl - 접근이 허용된 경우 리다이렉트할 URL
 * @returns {[boolean | undefined, boolean]} - 첫 번째 요소는 유저의 접근 허용 여부, 두 번째 요소는 로딩 상태
 *
 * @example
 * const [isAuthorized, loading] = useUser();
 *
 * if (loading) {
 *   return <LoadingSpinner />;
 * }
 *
 * if (isAuthorized) {
 *   return <Dashboard />;
 * } else {
 *   return <Redirect />;
 * }
 *
 * @example
 * const [_, loading] = useUser('/enter','/work/write');
 *
 * if (loading) {
 *   return <LoadingSpinner />;
 * }
 *
 */
export default function useUser(DeniedRedirectUrl?: string, approvedRedirectUrl?: string) {
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
    if (user && user.success === false && DeniedRedirectUrl) {
      router.push(DeniedRedirectUrl);
    } else if (user && user.success === true && approvedRedirectUrl) {
      router.push(approvedRedirectUrl);
    }
  }, [user, DeniedRedirectUrl, approvedRedirectUrl, router]);

  return [user?.success, loading];
}
