import withHandler from '@/libs/server/withHandler';
import { apiSessionWrapper } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body, session } = req;
	if (body === process.env.ADMIN_PASSWORD) {
		session.admin = {
			password: body,
		};
		await req.session.save();
		res.status(200).json({ success: true });
	} else {
		res.status(401).json({ success: true, message: 'Unautorized' });
	}
};

export default apiSessionWrapper(
	withHandler({ methods: ['POST'], handlerFunc: handler })
);
