import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
	seoTitle: string;
	children: ReactNode;
}

export default function Layout({ seoTitle, children }: LayoutProps) {
	const router = useRouter();
	return (
		<div className='relative scrollbar-hide'>
			<Head>
				<title>
					{router.pathname === '/' ? `${seoTitle}` : `${seoTitle} | INSAN`}
				</title>
			</Head>
			<nav className='fixed z-[1] w-full h-[100px]'>
				<div className='mx-[60px] h-full flex justify-between items-center'>
					<Link href={'/'}>
						<Image
							src='/images/Logo.svg'
							alt='INSAN'
							width={28}
							height={42}
							className='cursor-pointer'
						/>
					</Link>
					<ul className='font-Roboto font-light text-[15px] text-[#E1E1E1] flex gap-9'>
						<Link href={'/work'}>Work</Link>
						<Link href={'/about'}>About</Link>
						<Link href={'/contact'}>Contact us</Link>
					</ul>
				</div>
			</nav>
			{children}
		</div>
	);
}
