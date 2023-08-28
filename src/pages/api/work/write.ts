import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { WorkInfos } from '@/pages/work/write';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const {
		body: { data, secret },
	} = req;

	if (secret !== process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN) {
		return res.status(401).json({ success: false, message: 'Invalid token' });
	}

	if (data.length > 0) {
		try {
			await Promise.all(
				data.map(async (el: WorkInfos) => {
					await client.works.upsert({
						where: { resourceId: el.resourceId },
						create: {
							title: el.title,
							resourceId: el.resourceId,
							description: el.description,
							category: el.category || 'film',
							date: el.date || 'no-date',
							thumbnailLink: el.thumbnailLink,
							animationThumbnailLink: el.animatedThumbnailLink,
						},
						update: {
							title: el.title,
							resourceId: el.resourceId,
							description: el.description,
							category: el.category ? el.category : 'film',
							date: el.date ? el.date : 'no-date',
							thumbnailLink: el.thumbnailLink,
							animationThumbnailLink: el.animatedThumbnailLink,
						},
					});
				})
			);
			const revalidatePages = ['/work', '/work/write', '/work/delete'];
			await Promise.all(
				revalidatePages.map((el: string) => {
					res.revalidate(el);
				})
			);
			return res.status(200).json({ success: true });
		} catch (error) {
			console.log(error);
			return res.status(500).json({ success: false, error });
		}
	} else {
		return res.status(500).json({ success: false });
	}
};

export default withHandler({ methods: ['POST'], handlerFunc: handler });
