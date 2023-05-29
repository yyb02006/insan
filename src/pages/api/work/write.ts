import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { WorkInfos } from '@/pages/work/write';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { body } = req;
	console.log(body);
	body.forEach(async (el: WorkInfos) => {
		await client.works.upsert({
			where: { resourceId: el.resourceId },
			create: {
				title: el.title,
				resourceId: el.resourceId,
				description: el.description,
			},
			update: {
				title: el.title,
				resourceId: el.resourceId,
				description: el.description,
			},
		});
	});
	res.json({ success: true });
}

export default withHandler({ methods: ['POST'], handlerFunc: handler });
