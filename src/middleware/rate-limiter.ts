import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 300,
	standardHeaders: true,
	legacyHeaders: true,
});

export default rateLimiter;
