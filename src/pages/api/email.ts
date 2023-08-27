import withHandler from '@/libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	service: 'naver',
	port: 587,
	host: 'smtp.naver.com',
	tls: {
		rejectUnauthorized: false,
	},
	auth: {
		user: process.env.NAVER_USER,
		pass: process.env.NAVER_PASS,
	},
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { title, email, message } = req.body;
	await new Promise((resolve, reject) => {
		transporter.verify((error, success) => {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log('Server is ready to take our messages');
				resolve(success);
			}
		});
	});
	const mailData = {
		from: process.env.NAVER_USER,
		to: process.env.NAVER_TO,
		subject: `${title}`,
		html: `<div style='background-Color:#101010; padding:32px; color:#eaeaea;'><div style='font-weight:800; font-size:2.5rem; margin-bottom:24px;'>${title}</div><div style='font-weight:400; font-size:1rem'><div>email : ${email}</div><div>message : ${message}</div></div></div>`,
	};
	const response: { ok: boolean; [key: string]: unknown } = await new Promise(
		(resolve, reject) => {
			transporter.sendMail(mailData, (error, info) => {
				if (error) {
					console.log(error);
					reject({ ok: false, error });
				} else {
					console.log(info);
					resolve({ ok: true, info });
				}
			});
		}
	);
	if (response.ok) {
		res.status(200).json({ success: true });
	} else {
		res.status(500).json({ success: false });
	}
}

export default withHandler({ methods: ['POST'], handlerFunc: handler });
