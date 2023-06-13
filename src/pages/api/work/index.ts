import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === 'GET') {
		const list = await client.works.findMany({
			select: {
				id: true,
				resourceId: true,
				title: true,
				description: true,
				category: true,
			},
		});
		return res.json({ success: true, list });
	}
	if (req.method === 'POST') {
		const { body } = req;
		console.log(body);
		body.forEach(async (el: number) => {
			await client.works.delete({ where: { id: el } });
		});
		return res.json({ success: true });
	}
};

export default withHandler({
	methods: ['GET', 'POST', 'DELETE'],
	handlerFunc: handler,
});
