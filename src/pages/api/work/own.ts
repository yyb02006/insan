import withHandler from '@/libs/server/withHandler';
import { apiSessionWrapper } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { session } = req;
	if (session?.admin) {
		res.status(200).json({ success: true, message: 'Autorized' });
	} else {
		res.status(200).json({ success: false, message: 'Unautorized' });
	}
};

export default apiSessionWrapper(
	withHandler({ methods: ['GET'], handlerFunc: handler })
);
