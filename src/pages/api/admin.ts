import withHandler from '@/libs/server/withHandler';
import { apiSessionWrapper } from '@/libs/server/withSession';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  runtime: 'edge',
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { password, secret, action },
    session,
  } = req;

  if (secret !== process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  if (action === 'logout') {
    try {
      console.time('Logout session destroy Start');
      req.session.destroy();
      console.timeEnd('Logout session destroy End');
      console.time('Logout revalidate Start');
      await res.revalidate('/work');
      console.timeEnd('Logout revalidate End');
      return res.status(200).json({ success: true, message: 'Session Expired' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  } else if (action === 'login' && password === process.env.ADMIN_PASSWORD) {
    try {
      session.admin = {
        password,
      };
      console.time('Login session save Start');
      await req.session.save();
      console.timeEnd('Login session save End');
      const revalidatePages = ['/work', '/work/write', '/work/delete'];
      console.time('Login revalidate Start');
      await Promise.all(
        revalidatePages.map(async (el: string) => {
          await res.revalidate(el);
        })
      );
      console.timeEnd('Login revalidate End');
      return res.status(200).json({ success: true, message: 'Autorized' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Unautorized' });
  }
};

export default apiSessionWrapper(withHandler({ methods: ['POST'], handlerFunc: handler }));
