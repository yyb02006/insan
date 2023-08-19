import withHandler from '@/libs/server/withHandler';
import { apiSessionWrapper } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		body,
		session,
		query: { secret },
	} = req;

	if (secret !== process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN) {
		return res.status(401).json({ success: false, message: 'Invalid token' });
	}

	if (body === process.env.ADMIN_PASSWORD) {
		try {
			session.admin = {
				password: body,
			};
			await req.session.save();
			await res.revalidate('/work/write');
			return res.status(200).json({ success: true, message: 'Autorized' });
		} catch (error) {
			return res.status(500).json({ success: false, error });
		}
	} else {
		return res.status(200).json({ success: false, message: 'Unautorized' });
	}
};

export default apiSessionWrapper(
	withHandler({ methods: ['POST'], handlerFunc: handler })
);
