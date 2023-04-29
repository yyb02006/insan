import { cls } from '@/libs/client/utils';
import {
	AnimatePresence,
	stagger,
	useAnimate,
	usePresence,
	motion,
} from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

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

const ExtendedNav = () => {
	const [ispresent, safeToRemove] = usePresence();
	const [scope, animate] = useAnimate();
	useEffect(() => {
		if (ispresent) {
			const enterAnimation = async () => {
				animate(scope.current, { scale: 1 }, { duration: 0.4 });
				animate(scope.current, { borderRadius: 0 }, { duration: 0.4 });
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				animate(
					scope.current,
					{ borderRadius: '0% 0% 0% 100%' },
					{ duration: 0.2 }
				);
				await animate(scope.current, { scale: 0 }, { duration: 0.4 });
				safeToRemove();
			};
			exitAnimation();
		}
	}, [ispresent]);
	return (
		<motion.div
			ref={scope}
			initial={{ scale: 0 }}
			className='origin-top-right box-content fixed rounded-es-full left-0 top-0 w-[100vw] h-[100vh] bg-[#101010]'
		>
			<ul
				style={{ WebkitTextStroke: '1px #eaeaea' }}
				className='text-[8rem] text-[#101010] font-bold font-GmarketSans flex flex-col items-center justify-center w-full h-full'
			>
				<li>Work</li>
				<li>About</li>
				<li>Contact</li>
			</ul>
		</motion.div>
	);
};

const HamburgerMenu = () => {
	const [isPresent, safeToRemove] = usePresence();
	const [isOpen, setIsOpen] = useState(false);
	const [navRef, animate] = useAnimate();
	useEffect(() => {
		if (isPresent) {
			const enterAnimation = async () => {
				await animate(
					'.ButtonShapes',
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
					'.ButtonShapes',
					{ x: [0, 84] },
					{ duration: 0.2, ease: 'easeOut', delay: stagger(0.2) }
				);
				safeToRemove();
			};
			exitAnimation();
		}
	}, [isPresent]);
	useEffect(() => {
		if (isOpen && isPresent) {
			animate('.top', { y: 11.5, rotate: -45 });
			animate('.bottom', { y: -11.5, rotate: 45 });
			animate('.middle', { opacity: 0 });
		} else if (!isOpen && isPresent) {
			animate('.top', { y: 0, rotate: 0 });
			animate('.bottom', { y: 0, rotate: 0 });
			animate('.middle', { opacity: 1 });
		}
	}, [isOpen, isPresent]);
	return (
		<ul
			ref={navRef}
			className='absolute flex justify-center items-center right-0 w-6 aspect-square font-Roboto font-light text-[15px] text-[#E1E1E1] gap-9'
		>
			<AnimatePresence>{isOpen ? <ExtendedNav /> : null}</AnimatePresence>
			<div
				onClick={() => {
					setIsOpen((p) => !p);
				}}
				className='relative h-16 cursor-pointer aspect-square bg-[#101010] rounded-full flex justify-center items-center group'
			>
				<ul className='h-6 aspect-square flex flex-col justify-between items-end'>
					{[
						{ position: 'top', width: 'w-6' },
						{ position: 'middle', width: 'w-4' },
						{ position: 'bottom', width: 'w-6' },
					].map((arr, idx) => (
						<li
							key={idx}
							className={cls(
								cls(arr.position, arr.width),
								'ButtonShapes h-[1px] origin-center bg-[#cacaca] rounded-full translate-x-[84px] group-hover:bg-palettered transition-colors duration-300'
							)}
						/>
					))}
				</ul>
			</div>
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
