import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const list = await client.works.findMany();
	const work = {
		film: list.filter((el) => el.category === 'film'),
		short: list.filter((el) => el.category === 'short'),
		outsource: list.filter((el) => el.category === 'outsource'),
	};
	res.json({ success: true, work });
};

export default withHandler({ methods: ['GET'], handlerFunc: handler });

export const config = {
	api: {
		externalResolver: true,
	},
};
