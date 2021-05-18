import express from 'express';
import router from './routes';
import passport from 'passport';
import MagicLoginStrategy from 'passport-magic-login';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { getOrCreateUserWithEmail, getUserById } from './db/user';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
dotenv.config();
import sendEmail from './utils/email';
import { getParameterByName } from './utils/url';

const redisStore = connectRedis(session);
const redisClient = redis.createClient({
	url: process.env.REDIS_URL,
});
export const app = express();
const port = process.env.PORT || 3001;

const magicLogin = new MagicLoginStrategy({
	//@ts-ignore
	secret: process.env.EMAIL_JWT_SECRET,
	callbackUrl: '/auth/magiclogin/callback',
	sendMagicLink: async (destination, href, verificationCode) => {
		const token = getParameterByName('token', 'domain.com' + href);

		await sendEmail({
			to: destination,
			text: `Login with code ${verificationCode} by clicking this link: https://gram.himar.dev/callback?token=${token}`,
			subject: 'Log in to gram',
		});
		console.log(
			`Email sent to ${destination} with code ${verificationCode} and with ${href}`
		);
	},
	verify: (payload, callback) => {
		// console.log('payload: ', payload);
		getOrCreateUserWithEmail(payload.destination)
			.then((user) => {
				//@ts-ignore
				callback(null, user);
			})
			.catch((err) => {
				callback(err);
			});
	},
});

passport.use(magicLogin);

passport.serializeUser(function (user: any, done) {
	// console.log('serialize: ', user);
	done(null, user);
});

passport.deserializeUser(async function (user: any, done) {
	// console.log('deserialize: ', user);
	getUserById(user.id)
		.then((user) => {
			done(null, user);
		})
		.catch((e) => done(e));
});

app.use(express.json());
app.use(
	cors({
		origin: [
			'https://gram.himar.dev',
			'http://gram.himar.dev',
			'gram.himar.dev',
		],
		methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
		credentials: true,
	})
);
app.use(
	session({
		store: new redisStore({ client: redisClient }),
		//@ts-ignore
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		name: 'auth',
		cookie: {
			secure: false,
			httpOnly: true,
			maxAge: 30 * 24 * 60 * 60 * 1000,
		},
		// cookie: { secure: true, sameSite: 'strict' },
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
	(
		err: any,
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		console.error(err.stack);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
	}
);
app.use(router);

// This is where we POST to from the frontend
app.post('/auth/magiclogin', magicLogin.send);

// The standard passport callback setup
app.get(
	'/auth/magiclogin/callback',
	passport.authenticate('magiclogin'),
	(req, res) => {
		// console.log('callback user: ', req.user);
		return res.json({ user: req.user });
	}
);

export function start() {
	app.listen(port, () => {
		console.log(`Server listening at http://localhost:${port}`);
	});
}
