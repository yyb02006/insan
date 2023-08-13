import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiHandler } from 'next';

declare module 'iron-session' {
	interface IronSessionData {
		admin?: {
			password: string;
		};
	}
}

const cookieOptions = {
	cookieName: 'insanSession',
	password: process.env.COOKIE_PASSWORD as string,
};

export function apiSessionWrapper(fn: NextApiHandler) {
	console.log(process.env.ADMIN_PASSWORD);

	return withIronSessionApiRoute(fn, cookieOptions);
}
