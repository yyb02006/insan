import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { apiSessionWrapper } from '@/libs/server/withSession';
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
				date: true,
				thumbnailLink: true,
			},
		});
		return res.json({ success: true, list });
	}
	if (req.method === 'POST') {
		const { body } = req;
		console.log('this is body' + body);
		await Promise.all(
			body.map(async (el: number) => {
				await client.works.delete({ where: { id: el } });
			})
		);
		return res.json({ success: true });
	}
	if (req.method === 'DELETE') {
		const ids = req.headers['ids-to-delete'];
		console.log(ids);
		return res.status(200).end();
	}
};

export default apiSessionWrapper(
	withHandler({
		methods: ['GET', 'POST', 'DELETE'],
		handlerFunc: handler,
		inspection: { targetMethods: ['POST', 'DELETE'], onInspection: true },
	})
);
