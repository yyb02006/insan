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
  const { page, per_page, category, order } = query;
  if (!page || !per_page) return;
  const take = +per_page;
  const skip = +per_page * (+page - 1);
  const id = order === 'asc' ? 'asc' : 'desc';
  let works: VideoResponseItem = {
    film: [],
    short: [],
    outsource: [],
  };
  const restOptions: { skip: number; take: number; orderBy: { id: typeof id } } = {
    skip,
    take,
    orderBy: { id: 'desc' },
  };
  if (category === 'film') {
    works.film = await client.works.findMany({
      where: { category: 'film' },
      ...restOptions,
    });
  } else if (category === 'short') {
    works.short = await client.works.findMany({
      where: { category: 'short' },
      ...restOptions,
    });
  } else if (category === 'filmShort') {
    works.film = await client.works.findMany({
      where: { OR: [{ category: 'film' }, { category: 'short' }] },
      ...restOptions,
    });
  } else if (category === 'outsource') {
    works.outsource = await client.works.findMany({
      where: { category: 'outsource' },
      ...restOptions,
    });
  } else {
    works = {
      film: await client.works.findMany({
        where: { category: 'film' },
        ...restOptions,
      }),
      short: await client.works.findMany({
        where: { category: 'short' },
        ...restOptions,
      }),
      outsource: await client.works.findMany({
        where: { category: 'outsource' },
        ...restOptions,
      }),
    };
  }
  return res.status(200).json({ success: true, works });
};

export default withHandler({ methods: ['GET'], handlerFunc: handler });

export const config = {
  api: {
    externalResolver: true,
  },
};
