import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { query } = req;
	if (query.from === 'write') {
		const lists = await client.works.findMany({
			select: {
				title: true,
				category: true,
				date: true,
				description: true,
				resourceId: true,
			},
		});
		const work = {
			filmShort: lists.filter(
				(list) => list.category === 'film' || list.category === 'short'
			),
			outsource: lists.filter((list) => list.category === 'outsource'),
		};
		res.status(200).json({ success: true, work });
	} else {
		const lists = await client.works.findMany();
		const work = {
			film: lists.filter((el) => el.category === 'film'),
			short: lists.filter((el) => el.category === 'short'),
			outsource: lists.filter((el) => el.category === 'outsource'),
		};
		res.status(200).json({ success: true, work });
	}
};

export default withHandler({ methods: ['GET'], handlerFunc: handler });

export const config = {
	api: {
		externalResolver: true,
	},
};
