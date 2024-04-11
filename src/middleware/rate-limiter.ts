import rateLimit from 'express-rate-limit';
import { env } from '../environment-config';

const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: env.NODE_ENV === 'production' ? 2000 : 2000,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		res.status(429).json({
			success: false,
			message: 'Too many requests, please try again later.',
		});
	},
});

export default rateLimiter;
