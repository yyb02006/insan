import client from '@/libs/server/client';
import withHandler from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { body } = req;
	res.status(202).end();
}

export default withHandler({ methods: ['POST'], handlerFunc: handler });
