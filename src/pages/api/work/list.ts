import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		query: { kind },
	} = req;
	if (kind === 'outsource') {
		const work = await client.works.findMany();
		res.json({ success: true, work });
	}
};

export default withHandler({ methods: ['GET'], handlerFunc: handler });

export const config = {
	api: {
		externalResolver: true,
	},
};
