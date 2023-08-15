import { NextApiRequest, NextApiResponse } from 'next';

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface config {
	methods: Method[];
	handlerFunc: (req: NextApiRequest, res: NextApiResponse) => void;
	inspection?: { targetMethods: Method[]; onInspection: boolean };
}

export default function withHandler({
	methods,
	handlerFunc,
	inspection,
}: config) {
	return async function (req: NextApiRequest, res: NextApiResponse) {
		if (req.method && !methods.includes(req.method as Method)) {
			return res.status(405).end();
		}
		if (
			inspection?.onInspection &&
			inspection.targetMethods.includes(req.method as Method) &&
			req.session.admin?.password !== process.env.ADMIN_PASSWORD
		) {
			return res.status(401).end();
		}
		try {
			await handlerFunc(req, res);
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
