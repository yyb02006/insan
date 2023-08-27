import withHandler from '@/libs/server/withHandler';
import { apiSessionWrapper } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		body: { password, secret, action },
		session,
	} = req;

	if (secret !== process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN) {
		return res.status(401).json({ success: false, message: 'Invalid token' });
	}

	if (action === 'logout') {
		try {
			req.session.destroy();
			await res.revalidate('/work');
			return res
				.status(200)
				.json({ success: true, message: 'Session Expired' });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, error });
		}
	} else if (action === 'login' && password === process.env.ADMIN_PASSWORD) {
		try {
			session.admin = {
				password,
			};
			await req.session.save();
			const revalidatePages = ['/work', '/work/write', '/work/delete'];
			await Promise.all(
				revalidatePages.map(async (el: string) => {
					await res.revalidate(el);
				})
			);
			return res.status(200).json({ success: true, message: 'Autorized' });
		} catch (error) {
			return res.status(500).json({ success: false, error });
		}
	} else {
		return res.status(401).json({ success: false, message: 'Unautorized' });
	}
};

export default apiSessionWrapper(
	withHandler({ methods: ['POST'], handlerFunc: handler })
);
