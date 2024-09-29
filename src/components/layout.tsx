import { cls, fetchData } from '@/libs/client/utils';
import {
  AnimatePresence,
  stagger,
  useAnimate,
  usePresence,
  motion,
  useTransform,
} from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import Circles from './circles';
import useMouseSpring from '@/libs/client/useMouseSpring';
import ScrollBar from './scrollbar';
import useMutation from '@/libs/client/useMutation';
import { AuthResponse } from '@/pages/enter';
import LoaidngIndicator from './loadingIndicator';
import { VideoLength, useAppContext } from '@/appContext';
import useUser from '@/libs/client/useUser';
import HamburgerMenuWrapper from './postManagementNav';

interface LayoutProps {
  seoTitle: string;
  children: ReactNode;
  scrollbar?: boolean;
  css?: string;
  footerPosition?: string;
  nav?: { hasNav?: boolean; isCollapsed: boolean };
  logo?: boolean;
  menu?: { hasMenu?: boolean; menuComponent?: ReactNode };
  description?: string;
}

interface ListMenuProps {
  isAdmin: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

interface LogoutButtonProps {
  name: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const LogoutButton = ({ name, setIsLoading }: LogoutButtonProps) => {
  const router = useRouter();
  const [send, { loading, data }] = useMutation<AuthResponse>('/api/admin');
  const handleOnLogoutClick = () => {
    if (loading) return;
    send({
      action: 'logout',
      secret: process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN,
    });
  };
  useEffect(() => {
    if (data?.success === true) {
      switch (router.pathname) {
        case '/':
          router.reload();
          break;
        default:
          router.push('/');
          break;
      }
    } else if (data?.success === false) {
      console.error(data.error);
    }
  }, [data?.success, router]);
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);
  return <button onClick={handleOnLogoutClick}>{name}</button>;
};

const ListMenu = ({ isAdmin, setIsLoading }: ListMenuProps) => {
  const menuList = [
    { id: 'work', href: '/work', name: 'Work', type: 'link' },
    { id: 'about', href: '/about', name: 'About', type: 'link' },
    { id: 'contact', href: '/contact', name: 'Contact', type: 'link' },
    {
      id: 'auth',
      href: '/enter',
      name: isAdmin ? 'Logout' : 'Admin',
      type: isAdmin ? 'button' : 'link',
    },
  ];
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
  }, [isPresent, animate, safeToRemove]);
  return (
    <ul
      ref={navRef}
      className="relative z-[1] top-0 right-0 font-Roboto font-light text-[15px] text-[#E1E1E1] flex gap-9 "
    >
      {menuList.map((arr, idx) => (
        <li
          key={idx}
          className="relative opacity-0 hover:text-palettered transition-colors duration-300"
        >
          {arr.name === 'Logout' ? (
            <LogoutButton setIsLoading={setIsLoading} name={arr.name} />
          ) : (
            <Link href={arr.href}>{arr.name}</Link>
          )}
        </li>
      ))}
    </ul>
  );
};

const ExtendedNav = ({
  isMobile,
  videoLength,
  setIsLoading,
  setIsNavigating,
  isNavigating,
}: {
  isMobile: boolean;
  videoLength: VideoLength;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsNavigating: Dispatch<SetStateAction<boolean>>;
  isNavigating: boolean;
}) => {
  const router = useRouter();
  const [isUser] = useUser();
  const { onMove, onLeave, mouseX, mouseY } = useMouseSpring({
    limitHeight: 0,
    isMobile: isMobile,
  });
  const [ispresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const menu = [
    {
      name: 'Work',
      redWord: videoLength === undefined ? '' : videoLength,
      whiteletter: videoLength === undefined ? '' : ' video works',
      path: '/work',
    },
    {
      name: 'About',
      redWord: 'director',
      whiteletter: ' editor designer',
      path: '/about',
    },
    {
      name: 'Contact',
      redWord: 'email',
      whiteletter: ' nokedny1117@gmail.com',
      path: '/contact',
    },
  ];
  const x1 = useTransform(mouseX, (offset) => offset / 16);
  const x2 = useTransform(mouseX, (offset) => offset / 9);
  const y1 = useTransform(mouseY, (offset) => offset / 12);
  const y2 = useTransform(mouseY, (offset) => offset / 6);
  const circles = [
    { minimum: 'min-w-[900px]', width: 'w-[75%]', yRatio: y1, xRatio: x1 },
    {
      minimum: 'min-w-[600px]',
      width: 'w-[50%]',
      yRatio: y2,
      xRatio: x2,
    },
  ];
  useEffect(() => {
    if (ispresent) {
      const enterAnimation = async () => {
        setIsLoading(true);
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
        setIsLoading(false);
      };
      enterAnimation();
    } else {
      const exitAnimation = async () => {
        setIsLoading(true);
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
        animate(scope.current, { borderRadius: '0% 0% 0% 100%' }, { duration: 0.2 });
        await animate(scope.current, { scale: 0 }, { duration: 0.4 });
        safeToRemove();
        setIsLoading(false);
      };
      exitAnimation();
    }
  }, [ispresent, animate, safeToRemove, scope, setIsLoading]);
  const onLinkEnter = (selector: string) => {
    animate(`.${selector}`, { color: '#eaeaea', webkitTextStroke: '0px' }, { duration: 0.2 });
    animate(`.${selector}Letter`, { y: '110%' });
    animate(`.${selector}Line`, { width: '100%' });
  };
  const onLinkLeave = (selector: string) => {
    animate(
      `.${selector}`,
      {
        color: '#101010',
        webkitTextStroke: '1px #eaeaea',
      },
      { duration: 0.2 }
    );
    animate(`.${selector}Letter`, { y: '0%' });
    animate(`.${selector}Line`, { width: 0 });
  };
  const onLinkClick = (path: string) => {
    if (router.pathname === path) {
      router.reload();
    }
  };
  return (
    <motion.div
      ref={scope}
      initial={{ scale: 0 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="origin-top-right box-content fixed rounded-es-full left-0 top-0 w-[100vw] h-[100vh] bg-[#101010]"
    >
      <div className="font-bold font-GmarketSans flex flex-col items-center justify-center w-full h-full">
        <ul className="flex flex-col justify-center items-center leading-none space-y-14">
          {menu.map((menu, idx) => (
            <li key={idx} className="opacity-0 Menu relative">
              <motion.div
                className={cls(
                  `${menu.name}Letter`,
                  'absolute bottom-0 right-0 text-[calc(10px+0.75vw)] leading-normal font-extralight text-[#eaeaea] text-right'
                )}
              >
                <span className="text-palettered">{menu.redWord}</span>
                {menu.whiteletter}
              </motion.div>
              <Link href={menu.path}>
                <div
                  onClick={() => {
                    onLinkClick(menu.path);
                  }}
                  onMouseLeave={() => {
                    onLinkLeave(menu.name);
                  }}
                  onMouseEnter={() => {
                    onLinkEnter(menu.name);
                  }}
                  style={{ WebkitTextStroke: '1px #eaeaea' }}
                  className={cls(
                    menu.name,
                    'relative bg-[#101010] text-[#101010] text-[calc(50px+4vw)]'
                  )}
                >
                  {menu.name}
                </div>
              </Link>
              <motion.div
                className={cls(
                  `${menu.name}Line`,
                  'relative w-0 border-t border-[#eaeaea] rounded-full'
                )}
              />
            </li>
          ))}
          <div
            onClick={() => {
              if (isNavigating) return;
              setIsNavigating(true);
            }}
            className="Menu font-light self-end opacity-0 text-[#909090] hover:text-palettered"
          >
            <Link href={isUser ? '/work/write' : '/enter'}>{'Admin >'}</Link>
          </div>
        </ul>

        {/* 컴포넌트를 쪼개서 만드는 수밖에... */}
        {circles.map((element, idx) => (
          <motion.div
            key={idx}
            style={{
              x: element.xRatio,
              y: element.yRatio,
            }}
            className={cls(
              element.width,
              element.minimum,
              'Circles opacity-0 absolute aspect-square pointer-events-none'
            )}
          >
            <Circles liMotion={{ css: 'w-[calc(108%)]' }} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default function Layout({
  seoTitle,
  children,
  css,
  footerPosition = 'relative',
  nav = { hasNav: true, isCollapsed: false },
  logo = true,
  menu = { hasMenu: true, menuComponent: undefined },
  scrollbar = true,
  description,
}: LayoutProps) {
  const { videoLength, setVideoLength } = useAppContext();
  const layoutRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtended, setIsExtended] = useState(false);
  const [isAborted, setIsAborted] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { hasMenu, menuComponent } = menu;

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsMobile(
      /android(?!.*tablet)|iphone|blackberry|iemobile|opera mini|windows phone|mobile|lg|samsung|nokia|htc|xiaomi|sony|google|oneplus|realme/i.test(
        userAgent
      )
    );
    const getUser = async () => {
      const userInfo = await (await fetch('/api/work/own')).json();
      setIsAdmin(userInfo.success);
    };
    const getLength = async () => {
      const length = await fetchData('/api/work?purpose=length');
      const {
        works: { film, short, outsource },
      } = length;
      setVideoLength(film + short + outsource);
    };
    if (videoLength === undefined) {
      getLength();
    }
    getUser();
  }, []);

  useEffect(() => {
    if (isExtended) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isExtended]);

  return (
    <section ref={layoutRef} className={cls(css ? css : '', 'relative min-h-screen h-auto')}>
      <Head>
        <title>{router.pathname === '/' ? `${seoTitle}` : `${seoTitle} | INSAN`}</title>
        <meta
          name="description"
          content={
            description ||
            '선 좀 넘는 디렉터 여인산입니다. 주로 서울에서 활동하며 M/V, P/V, 유튜브, 숏폼, 관광/외식 등 다양한 영상분야에서 활동 중입니다.'
          }
        />
      </Head>
      {logo ? (
        <div className="fixed z-[1000] left-0 mt-6 ml-[40px] md:ml-[60px] w-[42px] h-[42px] flex justify-start items-center">
          <Link href={'/'} className="flex justify-center items-center">
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
      ) : null}
      {hasMenu ? (
        <div className="fixed z-[1001] right-0 mt-6 mr-[40px] md:mr-[60px] w-[42px] h-[42px] flex justify-end items-center">
          <AnimatePresence>
            {!nav.isCollapsed ? <ListMenu setIsLoading={setIsLoading} isAdmin={isAdmin} /> : null}
          </AnimatePresence>
          <AnimatePresence>
            {nav.isCollapsed ? (
              <HamburgerMenuWrapper
                isOpen={isExtended}
                isAborted={isAborted}
                isNavigating={isNavigating}
                setIsOpen={setIsExtended}
              >
                <ExtendedNav
                  videoLength={videoLength}
                  setIsLoading={setIsAborted}
                  isMobile={isMobile}
                  setIsNavigating={setIsNavigating}
                  isNavigating={isNavigating}
                />
              </HamburgerMenuWrapper>
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
      {scrollbar && !isExtended ? <ScrollBar paddingY={12} right={8} /> : null}
      {isLoading ? <LoaidngIndicator /> : null}
    </section>
  );
}
