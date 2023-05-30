import { NextApiRequest, NextApiResponse } from 'next';

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface config {
	methods: Method[];
	handlerFunc: (req: NextApiRequest, res: NextApiResponse) => void;
}

export default function withHandler({ methods, handlerFunc }: config) {
	return async function (req: NextApiRequest, res: NextApiResponse) {
		if (req.method && !methods.includes(req.method as Method)) {
			return res.status(405).end();
		}
		try {
			handlerFunc(req, res);
		} catch (err) {
			console.log(err);
			res.status(500).json(err);
		}
	};
}

export const config = {
	api: {
		externalResolver: true,
	},
};
