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
			className='relative z-[1] top-0 right-0 font-Roboto font-light text-[15px] text-[#E1E1E1] flex gap-9 '
		>
			{[
				{ href: '/work', name: 'Work' },
				{ href: '/about', name: 'About' },
				{ href: '/contact', name: 'Contact' },
			].map((arr, idx) => (
				<li
					key={idx}
					className='relative opacity-0 hover:text-palettered transition-colors duration-300'
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
			className='absolute bg-pink-600 flex justify-center items-center right-0 w-6 aspect-square font-Roboto font-light text-[15px] text-[#E1E1E1] gap-9'
		>
			<div className='absolute h-16 aspect-square bg-[#101010] rounded-full' />
			<Link href={'/work'}>
				<ul className='relative h-6 aspect-square flex flex-col justify-between items-end group'>
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
				<div className='fixed z-[1000] left-0 mt-6 ml-[60px] w-[42px] h-[42px] flex justify-start items-center'>
					<Link href={'/'} className='flex justify-center items-center'>
						<div className='absolute h-16 aspect-square bg-[#101010] rounded-full' />
						<Image
							src='/images/Logo.svg'
							alt='INSAN'
							width={28}
							height={42}
							className='relative cursor-pointer'
							priority={true}
						/>
					</Link>
				</div>
			) : null}
			{nav ? (
				<div className='fixed z-[1000] right-0 mt-6 mr-[60px] w-[42px] h-[42px] flex justify-end items-center'>
					<AnimatePresence>
						{!nav.isShort ? <ListMenu /> : null}
					</AnimatePresence>
					<AnimatePresence>
						{nav.isShort ? <HamburgerMenu /> : null}
					</AnimatePresence>
				</div>
			) : null}
			{children}
			<footer className='text-[#606060] text-xs flex justify-center items-start h-[5vh]'>
				2023 Insan - all rights reserved
			</footer>
		</div>
	);
}
