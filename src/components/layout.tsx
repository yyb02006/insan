import { cls } from '@/libs/client/utils';
import {
	AnimatePresence,
	stagger,
	useAnimate,
	usePresence,
} from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect } from 'react';

interface LayoutProps {
	seoTitle: string;
	children: ReactNode;
	nav?: { exist?: boolean; isShort: boolean };
}

const ListMenu = () => {
	const [isPresent, safeToRemove] = usePresence();
	const [navRef, animate] = useAnimate();
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await animate(
					'li',
					{ y: [-24, 0], opacity: [0, 1] },
					{
						duration: 0.2,
						ease: 'easeOut',
						delay: stagger(0.2),
					}
				);
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				await animate(
					'li',
					{ y: [0, -24], opacity: [1, 0] },
					{ duration: 0.2, ease: 'easeOut', delay: stagger(0.2, { from: 3 }) }
				);
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent]);
	return (
		<ul
			ref={navRef}
			className='relative top-0 right-0 font-Roboto font-light text-[15px] text-[#E1E1E1] flex gap-9 '
		>
			{[
				{ href: '/work', name: 'Work' },
				{ href: '/about', name: 'About' },
				{ href: '/contact', name: 'Contact' },
			].map((arr, idx) => (
				<li
					key={idx}
					className='opacity-0 hover:text-palettered transition-colors duration-300'
				>
					<Link href={arr.href}>{arr.name}</Link>
				</li>
			))}
		</ul>
	);
};

const HamburgerMenu = () => {
	const [isPresent, safeToRemove] = usePresence();
	const [navRef, animate] = useAnimate();
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await animate(
					'li',
					{ x: [84, 0] },
					{
						duration: 0.2,
						ease: 'easeOut',
						delay: stagger(0.2, { from: 3 }),
					}
				);
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				await animate(
					'li',
					{ x: [0, 84] },
					{ duration: 0.2, ease: 'easeOut', delay: stagger(0.2) }
				);
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent]);
	return (
		<ul
			ref={navRef}
			className='absolute top-0 right-0 font-Roboto font-light text-[15px] text-[#E1E1E1] flex gap-9'
		>
			<Link href={'/work'}>
				<ul className='h-6 aspect-square flex flex-col justify-between items-end group'>
					{['w-6', 'w-4', 'w-6'].map((arr, idx) => (
						<li
							key={idx}
							className={cls(
								arr,
								'h-[1px] bg-[#cacaca] rounded-full translate-x-[84px] group-hover:bg-palettered transition-colors duration-300'
							)}
						/>
					))}
				</ul>
			</Link>
		</ul>
	);
};

export default function Layout({
	seoTitle,
	children,
	nav = { exist: true, isShort: false },
}: LayoutProps) {
	const router = useRouter();
	return (
		<div className='relative'>
			<Head>
				<title>
					{router.pathname === '/' ? `${seoTitle}` : `${seoTitle} | INSAN`}
				</title>
			</Head>
			{nav ? (
				<nav className='fixed z-[1] w-full h-[100px] '>
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
						<div className='relative w-[50px] h-[24px] flex justify-end items-center'>
							{!nav.isShort ? (
								<AnimatePresence>
									<ListMenu />
								</AnimatePresence>
							) : (
								<AnimatePresence>
									<HamburgerMenu />
								</AnimatePresence>
							)}
						</div>
					</div>
				</nav>
			) : null}
			{children}
			<footer className='text-[#606060] text-xs flex justify-center items-start h-[5vh]'>
				2023 Insan - all rights reserved
			</footer>
		</div>
	);
}
