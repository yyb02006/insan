import Circles from '@/components/circles';
import Input from '@/components/input';
import LoaidngIndicator from '@/components/loadingIndicator';
import useMutation from '@/libs/client/useMutation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SyntheticEvent, useEffect, useState } from 'react';

export interface AuthResponse {
  success: boolean;
  message: string;
  error?: unknown;
}

export default function Admin() {
  const router = useRouter();
  const [password, setPassword] = useState<string>('');
  const [sendPassword, { loading, data, error }] = useMutation<AuthResponse>(`/api/admin`);

  const onPasswordChange = (e: SyntheticEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const onPasswordSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    sendPassword({
      password,
      action: 'login',
      secret: process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN,
    });
  };

  useEffect(() => {
    if (data?.success === true) {
      router.push('work/write');
    } else if (data?.success === false && data.error) {
      console.log(data.error);
    }
  }, [data?.success, router]);

  return (
    <div className="relative w-screen h-screen flex justify-center items-center bg-[#101010]">
      <div className="fixed z-[1000] left-0 top-0 mt-6 ml-[40px] md:ml-[60px] w-[42px] h-[42px] flex justify-start items-center">
        <Link href="/" className="flex justify-center items-center">
          <div className="absolute h-16 aspect-square bg-[#101010] rounded-full" />
          <Image
            src="/images/Logo.svg"
            alt="INSAN"
            width={28}
            height={42}
            className="relative cursor-pointer"
            priority
          />
        </Link>
      </div>
      <div className="max-w-[480px] w-full -translate-y-14">
        <div className="relative w-full space-y-1">
          <div className="absolute w-[120%] aspect-square top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            <Circles liMotion={{ css: 'w-[110%]' }} />
          </div>
          <form onSubmit={onPasswordSubmit} className="relative">
            <Input
              type="text"
              name="password"
              css="border border-[#eaeaea] placeholder:text-[#bababa]"
              onChange={onPasswordChange}
              value={password}
              placeholder="Enter Your Password"
            />
            <button className="bg-green-600 w-full h-10 font-semibold">Submit</button>
          </form>
        </div>
        {data?.success === false && !data.error ? (
          <span>Invalid password. Please try again</span>
        ) : data?.success === false && (data.error || error) ? (
          <span>F12 관리자모드의 console 내용 개발자에게 전달 필요</span>
        ) : null}
      </div>
      {loading || data?.success === true ? <LoaidngIndicator /> : null}
      {data?.success === true ? (
        <div className="fixed top-0 w-screen h-screen opacity-60 z-[1] flex justify-center items-center bg-black">
          <div>Authentication Successful</div>
        </div>
      ) : null}
    </div>
  );
}
