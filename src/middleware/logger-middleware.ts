import path from 'node:path';
import winston from 'winston';
import expressWinston from 'express-winston';

// Request logger middleware
export const requestLogger = expressWinston.logger({
	transports: [
		new winston.transports.File({
			filename: path.join(__dirname, '../../logs/request.log'),
		}),
	],
	format: winston.format.combine(winston.format.json()),
	meta: true,
	msg: 'HTTP {{req.method}} {{req.url}}',
	expressFormat: true,
	colorize: true,
});

// Error logger middleware
export const errorLogger = expressWinston.errorLogger({
	transports: [
		new winston.transports.File({
			filename: path.join(__dirname, '../../logs/error.log'),
		}),
	],
	format: winston.format.combine(winston.format.json()),
	meta: true,
	msg: 'ERROR: {{err.message}}',
});
