import withHandler from '@/libs/server/withHandler';
import { apiSessionWrapper } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { session } = req;
	console.log(session.admin);
	res.status(200).json({ success: true });
};

export default apiSessionWrapper(
	withHandler({ methods: ['POST'], handlerFunc: handler })
);
