import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { WorkInfos } from '@/pages/work/write';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		body,
		query: { secret },
	} = req;

	if (secret !== process.env.ODR_SECRET_TOKEN) {
		return res.status(401).json({ success: false, message: 'Invalid token' });
	}

	if (body.length > 0) {
		try {
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
			await res.revalidate('/work');
			return res.status(200).json({ success: true });
		} catch (error) {
			return res
				.status(500)
				.json({ success: false, message: 'Error Revalidating OR Error Query' });
		}
	} else {
		return res.status(500).json({ success: false });
	}
};

export default withHandler({ methods: ['POST'], handlerFunc: handler });
