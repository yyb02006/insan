import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { targetPath },
  } = req;
  try {
    if (process.env.NODE_ENV === 'production') {
      await client.$executeRaw`SET lock_timeout = '0';`;
      await client.$executeRaw`LOCK TABLE "RevalidationStatus" IN EXCLUSIVE MODE`;
    }

    const status = await client.revalidationStatus.findMany();
    const [revalidate, update] = [
      status.find(({ action }) => action === 'revalidate'),
      status.find(({ action }) => action === 'update'),
    ];

    if (typeof targetPath !== 'string') throw new Error('targetPath is not string');
    if (status.length > 2) throw new Error('The number of data rows exceeds the expected limit.');
    if (!update) throw new Error('Update date is not exist.');

    const shouldRevalidate = !(
      new Set([revalidate?.timestamp.getTime(), update.timestamp.getTime()]).size === 1
    );

    if (shouldRevalidate) {
      await res.revalidate(targetPath);

      await client.revalidationStatus.upsert({
        where: { action: 'revalidate' },
        create: { action: 'revalidate', timestamp: update.timestamp },
        update: { timestamp: update.timestamp },
      });
      return res
        .status(200)
        .json({ success: true, message: 'Revalidation success, data is up to date' });
    } else {
      return res
        .status(200)
        .json({ success: true, message: 'No revalidate needed, data is already up to date' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
};

export default withHandler({ methods: ['POST'], handlerFunc: handler });
