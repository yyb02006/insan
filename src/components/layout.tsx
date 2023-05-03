import { cls } from '@/libs/client/utils';
import {
	AnimatePresence,
	stagger,
	useAnimate,
	usePresence,
	motion,
	useTransform,
	MotionValue,
} from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import Circles from './circles';
import useMouseSpring from '@/libs/client/useMouseSpring';

interface LayoutProps {
	seoTitle: string;
	children: ReactNode;
	footerPosition?: string;
	nav?: { exist?: boolean; isShort: boolean };
}

interface mouseCoord {
	mouseX: MotionValue<any>;
	mouseY: MotionValue<any>;
}

interface ExtendedNavProps extends mouseCoord {}

interface HamburgerMenuProps extends mouseCoord {}

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

const ExtendedNav = ({ mouseX, mouseY }: ExtendedNavProps) => {
	const [ispresent, safeToRemove] = usePresence();
	const [scope, animate] = useAnimate();
	const menu = [
		{
			name: 'Work',
			redWord: '142',
			whiteletter: ' video works',
			href: '/work',
		},
		{
			name: 'About',
			redWord: 'director',
			whiteletter: ' editor designer',
			href: '/about',
		},
		{
			name: 'Contact',
			redWord: 'email',
			whiteletter: ' dlstks97@naver.com',
			href: '/contact',
		},
	];
	const circles = [
		{ minimum: 'min-w-[1200px]', width: 'w-[75%]', yRatio: 12, xRatio: 16 },
		{
			minimum: 'min-w-[800px]',
			width: 'w-[50%]',
			yRatio: 6,
			xRatio: 9,
		},
	];
	const wordsX = (ratio: number) =>
		useTransform(mouseX, (offset) => offset / ratio);
	const wordsY = (ratio: number) =>
		useTransform(mouseY, (offset) => offset / ratio);
	useEffect(() => {
		if (ispresent) {
			const enterAnimation = async () => {
				animate(scope.current, { scale: 1 }, { duration: 0.4 });
				await animate(scope.current, { borderRadius: 0 }, { duration: 0.4 });
				await animate(
					'.Circles',
					{ scale: [1.5, 1], opacity: [0, 1] },
					{
						duration: 0.3,
						ease: 'easeOut',
						type: 'spring',
						delay: stagger(0.2),
					}
				);
				animate(
					'.Menu',
					{ scale: [0.7, 1.2, 1], opacity: [0, 1] },
					{ duration: 0.3, ease: 'easeIn', type: 'spring', bounce: 0.5 }
				);
			};
			enterAnimation();
		} else {
			const exitAnimation = async () => {
				animate(
					'.Circles',
					{ scale: [1, 1.5], opacity: [1, 0] },
					{
						duration: 0.3,
						ease: 'easeOut',
						type: 'spring',
					}
				);
				await animate(
					'.Menu',
					{ scale: [1, 1.2, 0.7], opacity: [1, 0] },
					{ duration: 0.3, ease: 'easeIn', type: 'spring', bounce: 0.5 }
				);
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
	const onLinksEnter = (selector: string) => {
		animate(
			`.${selector}`,
			{ color: '#eaeaea', webkitTextStroke: '0px' },
			{ duration: 0.2 }
		);
		animate(`.${selector}Letter`, { y: 40 });
		animate(`.${selector}Line`, { width: '100%' });
	};
	const onLinksLeave = (selector: string) => {
		animate(
			`.${selector}`,
			{
				color: '#101010',
				webkitTextStroke: '1px #eaeaea',
			},
			{ duration: 0.2 }
		);
		animate(`.${selector}Letter`, { y: 0 });
		animate(`.${selector}Line`, { width: 0 });
	};
	return (
		<motion.div
			ref={scope}
			initial={{ scale: 0 }}
			className='origin-top-right box-content fixed rounded-es-full left-0 top-0 w-[100vw] h-[100vh] bg-[#101010]'
		>
			<div className='text-[8rem] text-[#101010] font-bold font-GmarketSans flex flex-col items-center justify-center w-full h-full'>
				<ul className='flex flex-col justify-center items-center leading-none space-y-14'>
					{menu.map((menu, idx) => (
						<li key={idx} className='opacity-0 Menu relative'>
							<motion.div
								className={cls(
									`${menu.name}Letter`,
									'absolute bottom-0 right-0 text-2xl font-extralight text-[#eaeaea] text-right mt-2'
								)}
							>
								<span className='text-palettered'>{menu.redWord}</span>
								{menu.whiteletter}
							</motion.div>
							<Link href={menu.href}>
								<div
									onMouseLeave={() => {
										onLinksLeave(menu.name);
									}}
									onMouseEnter={() => {
										onLinksEnter(menu.name);
									}}
									style={{ WebkitTextStroke: '1px #eaeaea' }}
									className={cls(
										menu.name,
										'relative bg-[#101010] text-[#101010]'
									)}
								>
									{menu.name}
								</div>
							</Link>
							<motion.div
								className={cls(
									`${menu.name}Line`,
									'relative w-0 border-t border-[#eaeaea] rounded-full -mt-2'
								)}
							/>
						</li>
					))}
				</ul>
				{circles.map((element, idx) => (
					<motion.div
						key={idx}
						style={{ x: wordsX(element.xRatio), y: wordsY(element.yRatio) }}
						className={cls(
							element.width,
							element.minimum,
							'Circles opacity-0 absolute aspect-square pointer-events-none'
						)}
					>
						<Circles liMotion={{ css: 'w-[calc(110%)]' }} />
					</motion.div>
				))}
			</div>
		</motion.div>
	);
};

const HamburgerMenu = ({ mouseX, mouseY }: HamburgerMenuProps) => {
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
			<AnimatePresence>
				{isOpen ? <ExtendedNav mouseX={mouseX} mouseY={mouseY} /> : null}
			</AnimatePresence>
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
	footerPosition = 'relative',
	nav = { exist: true, isShort: false },
}: LayoutProps) {
	const router = useRouter();
	const { onMove, onLeave, mouseX, mouseY } = useMouseSpring(0);
	return (
		<div
			onMouseMove={(e) => onMove(e)}
			onMouseLeave={onLeave}
			className='relative min-h-screen h-auto'
		>
			<Head>
				<title>
					{router.pathname === '/' ? `${seoTitle}` : `${seoTitle} | INSAN`}
				</title>
			</Head>
			{nav ? (
				<div className='fixed z-[1000] left-0 mt-6 ml-[40px] md:ml-[60px] w-[42px] h-[42px] flex justify-start items-center'>
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
				<div className='fixed z-[999] right-0 mt-6 mr-[40px] md:mr-[60px] w-[42px] h-[42px] flex justify-end items-center'>
					<AnimatePresence>
						{!nav.isShort ? <ListMenu /> : null}
					</AnimatePresence>
					<AnimatePresence>
						{nav.isShort ? (
							<HamburgerMenu mouseX={mouseX} mouseY={mouseY} />
						) : null}
					</AnimatePresence>
				</div>
			) : null}
			{children}
			<footer
				className={cls(
					footerPosition,
					'text-[#606060] text-xs flex justify-center items-start h-[5vh] bottom-0 w-full'
				)}
			>
				2023 Insan - all rights reserved
			</footer>
		</div>
	);
}
