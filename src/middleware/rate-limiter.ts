import rateLimit from 'express-rate-limit';
import { env } from '../environment-config';

const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: env.NODE_ENV === 'production' ? 2000 : 2000,
	standardHeaders: true,
	legacyHeaders: true,
});

export default rateLimiter;
