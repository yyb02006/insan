import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { WorkInfos } from '@/pages/work/write';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { body } = req;
	console.log(body);
	if (body.length > 0) {
		body.forEach(async (el: WorkInfos) => {
			await client.works.upsert({
				where: { resourceId: el.resourceId },
				create: {
					title: el.title,
					resourceId: el.resourceId,
					description: el.description,
					category: el.category ? el.category : 'film',
					date: el.date ? el.date : 'no-date',
					thumbnailLink: el.thumbnailLink,
				},
				update: {
					title: el.title,
					resourceId: el.resourceId,
					description: el.description,
					category: el.category ? el.category : 'film',
					date: el.date ? el.date : 'no-date',
					thumbnailLink: el.thumbnailLink,
				},
			});
		});
		res.status(200);
	} else {
		res.status(500);
	}
};

export default withHandler({ methods: ['POST'], handlerFunc: handler });
