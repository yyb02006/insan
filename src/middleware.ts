import {
	NextRequest,
	NextResponse,
	NextFetchEvent,
	userAgent,
} from 'next/server';
import { getIronSession } from 'iron-session/edge';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
	const res = NextResponse.next();
	const { isBot } = userAgent(req);
	if (isBot) {
		return NextResponse.redirect('/403');
	}
	const session = await getIronSession(req, res, {
		cookieName: 'insanSession',
		password: process.env.COOKIE_PASSWORD as string,
		cookieOptions: {
			secure: process.env.NODE_ENV === 'production',
		},
	});

	//헤더의 referer라는 속성을 get해서 저장 referer는 사용자가 어디에서 왔는지에 대한 정보가 담겨있음
	/* 	const prevUrl = new URL(
		req.headers.get('referer') || '/',
		process.env.NODE_ENV === 'production'
			? 'https://insan.vercel.app'
			: 'http://localhost:3000'
	); */
	const deniedPathname = ['/work/write', '/work/delete'];

	if (session.admin?.password !== process.env.ADMIN_PASSWORD) {
		if (deniedPathname.includes(req.nextUrl.pathname)) {
			return NextResponse.redirect(
				process.env.NODE_ENV === 'production'
					? 'https://insan.vercel.app'
					: 'http://localhost:3000'
			);
		}
	} else {
		if (req.nextUrl.pathname === '/enter') {
			return NextResponse.redirect(
				process.env.NODE_ENV === 'production'
					? 'https://insan.vercel.app/work/write'
					: 'http://localhost:3000/work/write'
			);
		}
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
