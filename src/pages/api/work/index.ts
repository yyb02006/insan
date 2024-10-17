import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { apiSessionWrapper } from '@/libs/server/withSession';
import { WorkInfos } from '@/pages/work/work';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { data, secret },
    query: { purpose },
  } = req;

  if (req.method === 'GET') {
    if (purpose === 'length') {
      const works = {
        film: await client.works.count({ where: { category: 'film' } }),
        short: await client.works.count({ where: { category: 'short' } }),
        outsource: await client.works.count({
          where: { category: 'outsource' },
        }),
      };
      return res.status(200).json({ success: true, works });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Wrong Parameter Or Not Resource To Response',
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const ids = req.headers['ids-to-delete'];

      if (!ids || Array.isArray(ids)) return res.status(500).json({ success: false });
      const parsedIds = JSON.parse(ids);

      /* iterable한 변수인지 구분법
			typeof ids[Symbol.iterator] === 'function' */

      await client.works.deleteMany({ where: { id: { in: parsedIds } } });
      await client.revalidationStatus.upsert({
        where: { action: 'update' },
        create: { action: 'update', timestamp: new Date().toISOString() },
        update: { timestamp: new Date().toISOString() },
      });

      /* await Promise.all(
				parsedIds.map(async (el: string) => {
					await client.works.delete({ where: { id: +el } });
				})
			); */

      /*       const revalidatePages = ['/work', '/work/write', '/work/delete'];
      await Promise.all(
        revalidatePages.map(async (el: string) => {
          await res.revalidate(el);
        })
      ); */
      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  }

  if (req.method === 'POST') {
    if (secret !== process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: 'No data was provided' });
    }

    if (purpose === 'sort') {
      try {
        await client.$transaction(
          data.map((el: { id: number; currentOrder: number; originalOrder: number }) => {
            return client.works.update({
              where: { id: el.id },
              data: { order: el.currentOrder },
            });
          })
        );
        await client.revalidationStatus.upsert({
          where: { action: 'update' },
          create: { action: 'update', timestamp: new Date().toISOString() },
          update: { timestamp: new Date().toISOString() },
        });
        return res.status(200).json({ success: true });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error });
      }
    } else if (purpose === 'write') {
      try {
        await client.$transaction(
          data.map((el: WorkInfos) =>
            client.works.upsert({
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
            })
          )
        );
        await client.revalidationStatus.upsert({
          where: { action: 'update' },
          create: { action: 'update', timestamp: new Date().toISOString() },
          update: { timestamp: new Date().toISOString() },
        });
        /*       const revalidatePages = ['/work', '/work/write', '/work/delete'];
          await Promise.all(
            revalidatePages.map(async (el: string) => {
              await res.revalidate(el);
            })
          ); */
        return res.status(200).json({ success: true });
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid Purpose Query' });
    }
  }
};

export default apiSessionWrapper(
  withHandler({
    methods: ['GET', 'DELETE', 'POST'],
    handlerFunc: handler,
    inspection: { targetMethods: ['DELETE', 'POST'], onInspection: true },
  })
);
