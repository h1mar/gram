import sendgrid from '@sendgrid/mail';
//@ts-ignore
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

interface Options {
	to: string;
	text: string;
	subject: string;
}

export default async function sendEmail(options: Options) {
	return sendgrid.send({
		to: options.to,
		from: 'test@himar.dev',
		text: options.text,
		subject: options.subject,
	});
}
