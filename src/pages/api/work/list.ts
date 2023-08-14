import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { Works } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export interface VideoResponseItem {
	film: Works[];
	short: Works[];
	outsource: Works[];
}

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
		const { page, per_page, category } = query;
		if (!page || !per_page) return;
		const take = +per_page;
		const skip = +per_page * (+page - 1);
		let works: VideoResponseItem = {
			film: [],
			short: [],
			outsource: [],
		};
		console.log(take, skip);
		if (category === 'film') {
			works.film = await client.works.findMany({
				where: { category: 'film' },
				skip,
				take,
			});
		} else if (category === 'short') {
			works.short = await client.works.findMany({
				where: { category: 'short' },
				skip,
				take,
			});
		} else if (category === 'outsource') {
			works.outsource = await client.works.findMany({
				where: { category: 'outsource' },
				skip,
				take,
			});
		} else {
			works = {
				film: await client.works.findMany({
					where: { category: 'film' },
					skip,
					take,
				}),
				short: await client.works.findMany({
					where: { category: 'short' },
					skip,
					take,
				}),
				outsource: await client.works.findMany({
					where: { category: 'outsource' },
					skip,
					take,
				}),
			};
		}
		res.status(200).json({ success: true, works });
	}
};

export default withHandler({ methods: ['GET'], handlerFunc: handler });

export const config = {
	api: {
		externalResolver: true,
	},
};
