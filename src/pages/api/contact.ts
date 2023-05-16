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
	console.log(title, email, message);

	if (req.method !== 'POST') {
		res.status(405).end();
		return;
	}
	await transporter.sendMail(
		{
			from: process.env.NAVER_USER,
			to: 'nokedny1117@gmail.com',
			subject: `${title}`,
			html: `<div style='background-Color:#101010; padding:32px; color:#eaeaea;'><div style='font-weight:800; font-size:2.5rem; margin-bottom:24px;'>${title}</div><div style='font-weight:400; font-size:1rem'><div>email : ${email}</div><div>message : ${message}</div></div></div>`,
		},
		(err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log('success');
			}
		}
	);
	res.status(202).end();
}

export default handler;
